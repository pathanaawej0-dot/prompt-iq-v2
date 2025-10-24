import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

const TOTAL_SPOTS = 250;

export async function GET(request: NextRequest) {
  try {
    const db = getAdminDb();
    
    // Count total waitlist entries
    const waitlistSnapshot = await db.collection('waitlist').count().get();
    const totalSignups = waitlistSnapshot.data().count;
    
    const remaining = Math.max(0, TOTAL_SPOTS - totalSignups);
    
    return NextResponse.json({
      success: true,
      total: TOTAL_SPOTS,
      signups: totalSignups,
      remaining: remaining
    });
  } catch (error: any) {
    console.error('❌ Error getting waitlist count:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get count' },
      { status: 500 }
    );
  }
}
