import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 });
    }

    // Find share link
    const db = getAdminDb();
    const querySnapshot = await db.collection('shared_links')
      .where('code', '==', code)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const linkDoc = querySnapshot.docs[0];
    const linkData = linkDoc.data();

    // Check expiry
    const expiresAt = linkData.expires_at?.toDate ? linkData.expires_at.toDate() : new Date(linkData.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: 'Link expired' }, { status: 410 });
    }

    // Get prompt
    const promptSnap = await db.collection('prompts').doc(linkData.prompt_id).get();

    if (!promptSnap.exists) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    // Increment view count
    await linkDoc.ref.update({
      views: FieldValue.increment(1)
    });

    const promptData = promptSnap.data();
    
    if (!promptData) {
      return NextResponse.json({ error: 'Prompt data not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      prompt: {
        ...promptData,
        created_at: promptData.created_at?.toDate?.() || new Date()
      },
      views: (linkData.views || 0) + 1
    });
  } catch (error: any) {
    console.error('Error fetching shared link:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch link' },
      { status: 500 }
    );
  }
}
