import { NextRequest, NextResponse } from 'next/server';
import { createPhonePeOrder } from '@/lib/phonepe';
import { Plan } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, userId } = body;

    if (!plan || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (plan === 'spark') {
      return NextResponse.json(
        { error: 'Cannot create order for free plan' },
        { status: 400 }
      );
    }

    const result = await createPhonePeOrder(plan as Plan, userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create payment order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl,
      orderId: result.orderId,
    });
  } catch (error: any) {
    console.error('Create order API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
