import { NextRequest, NextResponse } from 'next/server';
import { generatePrompt, refinePrompt } from '@/lib/gemini';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Framework } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, framework, userId, mode, originalPrompt, parentId } = body;

    if (!input || !framework || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const used = userData?.generations_used || 0;
    const limit = userData?.generations_limit || 30;

    // Check generation limit
    if (used >= limit) {
      return NextResponse.json(
        { error: 'Generation limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Generate or refine prompt with quota error handling
    let result;
    try {
      if (mode === 'refine' && originalPrompt) {
        result = await refinePrompt(originalPrompt, input, framework as Framework);
      } else {
        result = await generatePrompt(input, framework as Framework);
      }
    } catch (geminiError: any) {
      console.error('❌ Gemini API error:', geminiError);
      
      // Check if it's a quota/rate limit error
      const errorMessage = geminiError.message?.toLowerCase() || '';
      const isQuotaError = 
        errorMessage.includes('quota') || 
        errorMessage.includes('rate limit') ||
        errorMessage.includes('resource exhausted') ||
        errorMessage.includes('429') ||
        geminiError.status === 429 ||
        geminiError.code === 429;
      
      if (isQuotaError) {
        return NextResponse.json({ 
          error: 'quota_exceeded',
          message: '🚀 PromptIQ is experiencing incredible demand! Our free tier is at capacity right now. Please try again in a few minutes, or upgrade to Pro to skip the queue and get priority access.'
        }, { status: 429 });
      }
      
      // Re-throw other errors to be caught by outer catch
      throw geminiError;
    }

    // Save prompt to Firestore
    const promptRef = await db.collection('prompts').add({
      user_id: userId,
      input_text: input,
      output_text: result.output,
      framework: framework,
      quality_score: result.qualityScore.total,
      created_at: FieldValue.serverTimestamp(),
      version: mode === 'refine' ? 2 : 1,
      parent_id: parentId || null,
      tokens_used: Math.ceil(result.output.length / 4),
    });

    // Update user's generation count
    await db.collection('users').doc(userId).update({
      generations_used: FieldValue.increment(1),
      updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      output: result.output,
      qualityScore: result.qualityScore,
      promptId: promptRef.id,
    });
  } catch (error: any) {
    console.error('❌ Generate API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
