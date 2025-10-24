'use client';

import { useState } from 'react';
import { Plan } from '@/types';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (plan: Plan, userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, userId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      // Redirect to PhonePe payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }

      return data;
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error };
}
