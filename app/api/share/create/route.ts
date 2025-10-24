import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

function generateShortCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { promptId, userId } = body;

    console.log('📝 Share link request:', { promptId, userId });

    if (!promptId || !userId) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const code = generateShortCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    console.log('🔧 Initializing Firebase Admin DB...');
    const db = getAdminDb();
    
    console.log('💾 Creating share link document...');
    await db.collection('shared_links').add({
      code,
      prompt_id: promptId,
      user_id: userId,
      created_at: FieldValue.serverTimestamp(),
      expires_at: expiresAt,
      views: 0
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/p/${code}`;
    
    console.log('🌐 Base URL:', baseUrl);
    console.log('✅ Share link created successfully:', shareUrl);

    const response = { success: true, shareUrl, code };
    console.log('📤 Sending response:', JSON.stringify(response));
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('❌ Error creating share link:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create share link' },
      { status: 500 }
    );
  }
}
