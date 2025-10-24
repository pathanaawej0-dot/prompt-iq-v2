import { NextRequest, NextResponse } from 'next/server';
import { verifyPhonePeWebhook } from '@/lib/phonepe';
import { updateUserPlan } from '@/lib/firebase';
import { PLAN_PRICES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Verify webhook signature
    const isValid = verifyPhonePeWebhook(payload);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Process payment update
    if (payload.code === 'PAYMENT_SUCCESS') {
      const transactionId = payload.data.merchantTransactionId;
      const amount = payload.data.amount / 100; // Convert from paise to rupees
      
      // Extract user ID from transaction ID
      const parts = transactionId.split('_');
      const userId = parts[2];
      
      // Determine plan from amount
      let plan: 'architect' | 'studio' = 'architect';
      if (amount === PLAN_PRICES.studio) {
        plan = 'studio';
      }

      // Update user's plan
      await updateUserPlan(userId, plan, transactionId, amount);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook API error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
