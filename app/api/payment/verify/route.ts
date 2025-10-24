import { NextRequest, NextResponse } from 'next/server';
import { verifyPhonePePayment } from '@/lib/phonepe';
import { updateUserPlan } from '@/lib/firebase';
import { PLAN_PRICES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const transactionId = formData.get('transactionId') as string;

    if (!transactionId) {
      return NextResponse.redirect(
        new URL('/dashboard?payment=failed', request.url)
      );
    }

    const result = await verifyPhonePePayment(transactionId);

    if (result.success && result.data) {
      // Extract user ID and plan from transaction ID
      // Format: ORDER_timestamp_userId
      const parts = transactionId.split('_');
      const userId = parts[2];
      
      // Determine plan from amount
      const amount = result.data.amount / 100; // Convert from paise to rupees
      let plan: 'architect' | 'studio' = 'architect';
      
      if (amount === PLAN_PRICES.studio) {
        plan = 'studio';
      }

      // Update user's plan
      await updateUserPlan(userId, plan, transactionId, amount);

      return NextResponse.redirect(
        new URL('/dashboard?payment=success', request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL('/dashboard?payment=failed', request.url)
      );
    }
  } catch (error: any) {
    console.error('Verify payment API error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?payment=failed', request.url)
    );
  }
}
