import { NextRequest, NextResponse } from 'next/server';
import { deletePrompt } from '@/lib/firebase';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { promptId, userId } = body;

    if (!promptId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await deletePrompt(promptId, userId);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Delete prompt API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete prompt' },
      { status: 500 }
    );
  }
}
