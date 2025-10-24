'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { FRAMEWORKS } from '@/lib/constants';
import { Framework, QualityBreakdown } from '@/types';
import { Loader2, Sparkles } from 'lucide-react';
import { OutputDisplay } from './OutputDisplay';
import { toast } from 'sonner';

interface QuickModeProps {
  userId: string;
  onGenerate: (input: string, framework: Framework) => Promise<{ output: string; qualityScore: QualityBreakdown; promptId: string }>;
}

export function QuickMode({ userId, onGenerate }: QuickModeProps) {
  const [input, setInput] = useState('');
  const [framework, setFramework] = useState<Framework>('chain-of-thought');
  const [output, setOutput] = useState('');
  const [qualityScore, setQualityScore] = useState<QualityBreakdown | null>(null);
  const [promptId, setPromptId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter your idea');
      return;
    }

    try {
      setLoading(true);
      const result = await onGenerate(input, framework);
      setOutput(result.output);
      setQualityScore(result.qualityScore);
      setPromptId(result.promptId);
      toast.success('Prompt generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Framework Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Framework</label>
        <Select value={framework} onValueChange={(value) => setFramework(value as Framework)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FRAMEWORKS).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                <div>
                  <div className="font-medium">{value.name}</div>
                  <div className="text-xs text-muted-foreground">{value.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Idea</label>
              <Textarea
                placeholder="Describe what you want to create... (e.g., 'design a mobile app for meal planning')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[200px] resize-none"
                disabled={loading}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{input.length}/2000</span>
                <span>Press Cmd/Ctrl + Enter to generate</span>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Crafting legendary prompt...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Legendary Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <OutputDisplay
          output={output}
          qualityScore={qualityScore}
          loading={loading}
          userId={userId}
          input={input}
          framework={FRAMEWORKS[framework]?.name || framework}
          promptId={promptId}
        />
      </div>
    </div>
  );
}
