import { NextRequest, NextResponse } from 'next/server';
import { savePrompt } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, inputText, outputText, framework, qualityScore, version, parentId } = body;

    if (!userId || !inputText || !outputText || !framework) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const promptId = await savePrompt(
      userId,
      inputText,
      outputText,
      framework,
      qualityScore || 0,
      version || 1,
      parentId || null
    );

    return NextResponse.json({
      success: true,
      promptId,
    });
  } catch (error: any) {
    console.error('Save prompt API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save prompt' },
      { status: 500 }
    );
  }
}
