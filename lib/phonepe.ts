import crypto from 'crypto';
import { Plan } from '@/types';
import { PLAN_PRICES } from './constants';

interface PhonePePayload {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  paymentInstrument: {
    type: string;
  };
}

export function generatePhonePeChecksum(payload: PhonePePayload): string {
  const saltKey = process.env.PHONEPE_SALT_KEY || '';
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
  
  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString).toString('base64');
  const checksumString = base64Payload + '/pg/v1/pay' + saltKey;
  const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
  
  return `${checksum}###${saltIndex}`;
}

export function generateVerifyChecksum(merchantTransactionId: string): string {
  const saltKey = process.env.PHONEPE_SALT_KEY || '';
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
  const merchantId = process.env.PHONEPE_MERCHANT_ID || '';
  
  const checksumString = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
  const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
  
  return `${checksum}###${saltIndex}`;
}

export function verifyPhonePeWebhook(payload: any): boolean {
  try {
    const saltKey = process.env.PHONEPE_SALT_KEY || '';
    const receivedChecksum = payload.checksum;
    
    // Remove checksum from payload for verification
    const { checksum, ...payloadWithoutChecksum } = payload;
    
    const payloadString = JSON.stringify(payloadWithoutChecksum);
    const base64Payload = Buffer.from(payloadString).toString('base64');
    const checksumString = base64Payload + saltKey;
    const calculatedChecksum = crypto.createHash('sha256').update(checksumString).digest('hex');
    
    return calculatedChecksum === receivedChecksum.split('###')[0];
  } catch (error) {
    console.error('Error verifying PhonePe webhook:', error);
    return false;
  }
}

export async function createPhonePeOrder(
  plan: Plan,
  userId: string
): Promise<{ success: boolean; paymentUrl?: string; orderId?: string; error?: string }> {
  try {
    if (plan === 'spark') {
      return { success: false, error: 'Cannot create order for free plan' };
    }

    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    if (!merchantId) {
      throw new Error('PhonePe merchant ID not configured');
    }

    const amount = PLAN_PRICES[plan] * 100; // Convert to paise
    const orderId = `ORDER_${Date.now()}_${userId.substring(0, 8)}`;

    const payload: PhonePePayload = {
      merchantId,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount,
      redirectUrl: `${baseUrl}/api/payment/verify`,
      redirectMode: 'POST',
      callbackUrl: `${baseUrl}/api/payment/webhook`,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const checksum = generatePhonePeChecksum(payload);
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    const mode = process.env.PHONEPE_MODE || 'SANDBOX';
    const apiUrl = mode === 'PRODUCTION' 
      ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const data = await response.json();

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      return {
        success: true,
        paymentUrl: data.data.instrumentResponse.redirectInfo.url,
        orderId,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Failed to create payment order',
      };
    }
  } catch (error: any) {
    console.error('Error creating PhonePe order:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment order',
    };
  }
}

export async function verifyPhonePePayment(
  merchantTransactionId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    
    if (!merchantId) {
      throw new Error('PhonePe merchant ID not configured');
    }

    const checksum = generateVerifyChecksum(merchantTransactionId);

    const mode = process.env.PHONEPE_MODE || 'SANDBOX';
    const apiUrl = mode === 'PRODUCTION'
      ? `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`
      : `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      },
    });

    const data = await response.json();

    if (data.success && data.code === 'PAYMENT_SUCCESS') {
      return {
        success: true,
        data: data.data,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Payment verification failed',
      };
    }
  } catch (error: any) {
    console.error('Error verifying PhonePe payment:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}
