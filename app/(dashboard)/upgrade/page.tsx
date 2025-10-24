'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';
import { Navbar } from '@/components/shared/Navbar';
import { LoadingPage } from '@/components/shared/LoadingStates';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Loader2 } from 'lucide-react';
import { PLAN_FEATURES, PLAN_PRICES } from '@/lib/constants';
import { Plan } from '@/types';
import { UpgradeModal } from '@/components/UpgradeModal';

const plans = [
  {
    name: 'Spark',
    plan: 'spark' as Plan,
    price: 0,
    description: 'Perfect for trying out PromptIQ',
    features: PLAN_FEATURES.spark,
    popular: false,
  },
  {
    name: 'Architect',
    plan: 'architect' as Plan,
    price: PLAN_PRICES.architect,
    description: 'For professionals who create regularly',
    features: PLAN_FEATURES.architect,
    popular: true,
  },
  {
    name: 'Studio',
    plan: 'studio' as Plan,
    price: PLAN_PRICES.studio,
    description: 'For power users and teams',
    features: PLAN_FEATURES.studio,
    popular: false,
  },
];

export default function UpgradePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { initiatePayment, loading: paymentLoading } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleUpgrade = async (plan: Plan) => {
    if (!user) return;

    if (plan === 'spark') {
      return;
    }

    // Open waitlist modal instead of payment
    setModalOpen(true);
  };

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Unlock more features and higher limits.
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="capitalize">
                    {user.plan === 'spark' && '⚡ '}
                    {user.plan === 'architect' && '🏗️ '}
                    {user.plan === 'studio' && '🎨 '}
                    {user.plan}
                  </Badge>
                  <span className="text-2xl font-bold">
                    ₹{PLAN_PRICES[user.plan]}/month
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.generations_used} / {user.generations_limit} prompts used this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((planOption) => {
            const isCurrent = user.plan === planOption.plan;
            const isDowngrade = 
              (user.plan === 'studio' && planOption.plan !== 'studio') ||
              (user.plan === 'architect' && planOption.plan === 'spark');

            return (
              <Card
                key={planOption.plan}
                className={`relative ${
                  planOption.popular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : ''
                } ${isCurrent ? 'border-green-500' : ''}`}
              >
                {planOption.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="outline" className="bg-green-500 text-white border-green-500">
                      Current Plan
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{planOption.name}</CardTitle>
                  <CardDescription>{planOption.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₹{planOption.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {planOption.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={planOption.popular && !isCurrent ? 'default' : 'outline'}
                    disabled={isCurrent || isDowngrade || (paymentLoading && selectedPlan === planOption.plan)}
                    onClick={() => handleUpgrade(planOption.plan)}
                  >
                    {paymentLoading && selectedPlan === planOption.plan ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : isDowngrade ? (
                      'Contact Support'
                    ) : planOption.plan === 'spark' ? (
                      'Free Plan'
                    ) : (
                      <>
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade Now
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Need help choosing? Contact us at support@promptiq.com
        </p>
      </main>

      <UpgradeModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        userEmail={user?.email || ''}
      />
    </div>
  );
}
