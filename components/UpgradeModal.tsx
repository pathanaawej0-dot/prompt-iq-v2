'use client';

import { useState } from 'react';
import { X, Rocket, Mail, MessageCircle, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function UpgradeModal({ isOpen, onClose, userEmail = '' }: UpgradeModalProps) {
  const [email, setEmail] = useState(userEmail);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'upgrade_button',
        }),
      });

      if (response.ok) {
        toast.success("🎉 You're in! Your Founding Member spot is secured with 50% OFF!");
        onClose();
        setEmail('');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="text-5xl animate-bounce">🚀</div>
          </div>
          <DialogTitle className="text-2xl text-center font-bold">Join the First 250!</DialogTitle>
          <DialogDescription className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              The Pro plan launches <span className="font-bold text-purple-600 dark:text-purple-400">next week</span>.
              Be one of the first 250 users and get exclusive perks!
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 my-4 border border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">🎉</span>
            Founding Member Benefits:
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-base">💰</span>
              <span><strong>50% OFF first month</strong> (₹149 instead of ₹299)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base">✨</span>
              <span>200+ prompt generations/month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base">🎯</span>
              <span>Priority support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base">💎</span>
              <span>Founding member badge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-base">🚀</span>
              <span>Early access to new features</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium block">
              Join the waitlist - Lock in your 50% launch discount!
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {loading ? (
              <>
                <Rocket className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Join the First 250 - Get 50% OFF! 🎉
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t text-center space-y-2">
          <p className="text-sm text-muted-foreground">Need Pro access now?</p>
          <a
            href="https://wa.me/YOUR_WHATSAPP_NUMBER?text=Hi!%20I'm%20interested%20in%20PromptIQ%20Pro%20plan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 font-medium text-sm transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Contact us on WhatsApp
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
