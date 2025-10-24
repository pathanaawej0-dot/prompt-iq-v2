import { NextRequest, NextResponse } from 'next/server';
import { getUserPrompts } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const prompts = await getUserPrompts(userId, limit);

    return NextResponse.json({
      success: true,
      prompts,
    });
  } catch (error: any) {
    console.error('List prompts API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
