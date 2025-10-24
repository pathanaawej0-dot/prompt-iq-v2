'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/shared/Navbar';
import { LoadingPage } from '@/components/shared/LoadingStates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuickMode } from '@/components/dashboard/QuickMode';
import { ProMode } from '@/components/dashboard/ProMode';
import { Framework, QualityBreakdown } from '@/types';
import { toast } from 'sonner';
import { Zap, MessageSquare, Crown } from 'lucide-react';
import Link from 'next/link';
import { UpgradeModal } from '@/components/UpgradeModal';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('quick');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const payment = searchParams?.get('payment');
    if (payment === 'success') {
      toast.success('Payment successful! Your plan has been upgraded.');
    } else if (payment === 'failed') {
      toast.error('Payment failed. Please try again.');
    }
  }, [searchParams]);

  const handleGenerate = async (
    input: string,
    framework: Framework,
    mode?: string,
    originalPrompt?: string
  ): Promise<{ output: string; qualityScore: QualityBreakdown; promptId: string }> => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        framework,
        userId: user?.uid,
        mode,
        originalPrompt,
      }),
    });

    const data = await response.json();

    // Handle quota exceeded error
    if (response.status === 429 && data.error === 'quota_exceeded') {
      toast.error(data.message, { duration: 8000 });
      // Show upgrade modal to encourage Pro upgrade
      setUpgradeModalOpen(true);
      throw new Error(data.message);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to generate prompt');
    }

    return {
      output: data.output,
      qualityScore: data.qualityScore,
      promptId: data.promptId,
    };
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  const usagePercentage = (user.generations_used / user.generations_limit) * 100;
  const isProMode = user.plan !== 'spark';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}! 👋</h1>
            <p className="text-muted-foreground">Create legendary prompts with AI-powered precision</p>
          </div>

          {/* Usage Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Current Plan:</span>
                    <Badge variant={user.plan === 'spark' ? 'secondary' : 'default'} className="capitalize">
                      {user.plan === 'spark' && '⚡ '}
                      {user.plan === 'architect' && '🏗️ '}
                      {user.plan === 'studio' && '🎨 '}
                      {user.plan}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Prompts Used:</span>
                    <span className="font-medium">
                      {user.generations_used} / {user.generations_limit}
                    </span>
                  </div>
                  <div className="w-full sm:w-64 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        usagePercentage >= 90
                          ? 'bg-red-500'
                          : usagePercentage >= 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
                {user.plan === 'spark' && (
                  <Button onClick={() => setUpgradeModalOpen(true)}>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Mode
            </TabsTrigger>
            <TabsTrigger value="pro" className="flex items-center gap-2" disabled={!isProMode}>
              <MessageSquare className="h-4 w-4" />
              Pro Mode
              {!isProMode && <Badge variant="secondary" className="ml-1 text-xs">Premium</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-6">
            <QuickMode userId={user.uid} onGenerate={handleGenerate} />
          </TabsContent>

          <TabsContent value="pro" className="space-y-6">
            {isProMode ? (
              <ProMode userId={user.uid} onGenerate={handleGenerate} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Pro Mode - Premium Feature</CardTitle>
                  <CardDescription>
                    Unlock iterative refinement with conversational AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Pro Mode allows you to have a conversation with the AI to refine your prompts iteratively.
                    Perfect for complex projects that need multiple rounds of refinement.
                  </p>
                  <Button onClick={() => setUpgradeModalOpen(true)}>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Unlock Pro Mode
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <UpgradeModal 
        isOpen={upgradeModalOpen} 
        onClose={() => setUpgradeModalOpen(false)} 
        userEmail={user?.email || ''}
      />
    </div>
  );
}
