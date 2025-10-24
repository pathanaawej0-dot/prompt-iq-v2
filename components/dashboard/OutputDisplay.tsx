'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QualityBreakdown } from '@/types';
import { Copy, Download, Share2, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { SkeletonPrompt } from '@/components/shared/LoadingStates';
import { exportToPDF } from '@/lib/pdf-export';

interface OutputDisplayProps {
  output: string;
  qualityScore: QualityBreakdown | null;
  loading: boolean;
  userId: string;
  input?: string;
  framework?: string;
  promptId?: string;
}

export function OutputDisplay({ output, qualityScore, loading, userId, input, framework, promptId }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleCopy = async () => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = output;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
          } else {
            toast.error('Failed to copy');
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
          toast.error('Failed to copy');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy');
    }
  };

  const handleDownloadPDF = () => {
    if (!output || !input || !framework || !qualityScore) {
      toast.error('Missing data for PDF export');
      return;
    }

    try {
      exportToPDF({
        input,
        output,
        framework,
        qualityScore: qualityScore.total,
        date: new Date().toLocaleString()
      });
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleShare = async () => {
    if (!promptId) {
      toast.error('Please save the prompt first');
      return;
    }

    try {
      setSharing(true);
      console.log('🔗 Creating share link for:', { promptId, userId });
      
      const response = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, userId })
      });

      console.log('📡 Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (data.success) {
        // Copy to clipboard with fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(data.shareUrl);
          toast.success('Share link copied to clipboard!');
          console.log('✅ Share link copied:', data.shareUrl);
        } else {
          // Fallback for browsers that don't support clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = data.shareUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            toast.success('Share link copied to clipboard!');
            console.log('✅ Share link copied (fallback):', data.shareUrl);
          } catch (err) {
            console.error('Failed to copy:', err);
            toast.success(`Share link: ${data.shareUrl}`);
          }
          document.body.removeChild(textArea);
        }
      } else {
        console.error('❌ Share failed:', data.error);
        toast.error(data.error || 'Failed to create share link');
      }
    } catch (error) {
      console.error('❌ Share error:', error);
      toast.error('Failed to create share link');
    } finally {
      setSharing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStars = (score: number) => {
    const fullStars = Math.floor(score / 2);
    return '⭐'.repeat(fullStars);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Legendary Prompt</span>
          {qualityScore && (
            <Badge variant="outline" className="text-base">
              <span className={getScoreColor(qualityScore.total)}>
                {getStars(qualityScore.total)} {qualityScore.total}/10
              </span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <SkeletonPrompt />
        ) : output ? (
          <>
            <div className="prose prose-sm dark:prose-invert max-w-none min-h-[200px] max-h-[400px] overflow-y-auto p-4 rounded-lg border bg-muted/50">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>

            {qualityScore && (
              <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Quality Breakdown</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Structure:</span>
                    <span className="font-medium">{qualityScore.structure}/2.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clarity:</span>
                    <span className="font-medium">{qualityScore.clarity}/2.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Examples:</span>
                    <span className="font-medium">{qualityScore.examples}/2.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Specificity:</span>
                    <span className="font-medium">{qualityScore.specificity}/2.5</span>
                  </div>
                </div>
                {qualityScore.suggestions.length > 0 && (
                  <div className="space-y-1 pt-2 border-t">
                    <span className="text-xs font-medium text-muted-foreground">💡 Suggestions:</span>
                    <ul className="text-xs space-y-1">
                      {qualityScore.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-muted-foreground">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCopy} variant="outline" size="sm">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm" disabled={sharing}>
                <Share2 className="mr-2 h-4 w-4" />
                {sharing ? 'Creating...' : 'Share'}
              </Button>
            </div>
          </>
        ) : (
          <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <Sparkles className="h-12 w-12 mx-auto opacity-50" />
              <p>Your legendary prompt will appear here</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
