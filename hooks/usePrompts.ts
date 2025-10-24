'use client';

import { useState, useEffect } from 'react';
import { getUserPrompts } from '@/lib/firebase';
import { Prompt } from '@/types';

export function usePrompts(userId: string | undefined) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setPrompts([]);
      setLoading(false);
      return;
    }

    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const userPrompts = await getUserPrompts(userId);
        setPrompts(userPrompts);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching prompts:', err);
        setError(err.message || 'Failed to fetch prompts');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [userId]);

  const refreshPrompts = async () => {
    if (!userId) return;
    
    try {
      const userPrompts = await getUserPrompts(userId);
      setPrompts(userPrompts);
    } catch (err: any) {
      console.error('Error refreshing prompts:', err);
    }
  };

  return { prompts, loading, error, refreshPrompts };
}
