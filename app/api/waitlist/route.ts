import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    
    // Check if email already exists in waitlist
    const existingEntry = await db.collection('waitlist')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingEntry.empty) {
      return NextResponse.json({
        success: true,
        message: 'You are already on the waitlist!',
        alreadyExists: true
      });
    }

    // Add to waitlist
    await db.collection('waitlist').add({
      email,
      source: source || 'unknown',
      created_at: FieldValue.serverTimestamp(),
      notified: false
    });

    console.log('✅ Added to waitlist:', email, 'from:', source);

    // Get updated count
    const TOTAL_SPOTS = 250;
    const waitlistSnapshot = await db.collection('waitlist').count().get();
    const totalSignups = waitlistSnapshot.data().count;
    const remaining = Math.max(0, TOTAL_SPOTS - totalSignups);

    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist!',
      remaining: remaining
    });
  } catch (error: any) {
    console.error('❌ Error adding to waitlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}
