'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Sparkles, Eye, ArrowLeft, Home } from 'lucide-react';

export default function SharedPromptPage() {
  const params = useParams();
  const code = params.code as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrompt() {
      try {
        const response = await fetch(`/api/share/${code}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching shared prompt:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrompt();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data || !data.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Link Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">This share link doesn't exist or has expired.</p>
            <Link href="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go to PromptIQ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { prompt, views } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="text-2xl font-bold">PromptIQ</span>
          </Link>
          <Link href="/">
            <Button variant="default">
              <Home className="mr-2 h-4 w-4" />
              Go to PromptIQ
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Title */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="mb-2">
              <Eye className="mr-1 h-3 w-3" />
              Shared Prompt
            </Badge>
            <h1 className="text-3xl font-bold">Legendary Prompt</h1>
            <p className="text-muted-foreground">View and copy this AI-generated prompt</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{prompt.framework}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{views} views</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Original Input */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Original Input:
                </h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{prompt.input_text}</p>
                </div>
              </div>
              
              {/* Generated Prompt */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Generated Prompt:
                </h2>
                <div className="bg-muted p-4 rounded-lg border max-h-96 overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {prompt.output_text}
                  </pre>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                try {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(prompt.output_text);
                    toast.success('Copied to clipboard!');
                  } else {
                    // Fallback
                    const textArea = document.createElement('textarea');
                    textArea.value = prompt.output_text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                      document.execCommand('copy');
                      toast.success('Copied to clipboard!');
                    } catch (err) {
                      toast.error('Failed to copy');
                    }
                    document.body.removeChild(textArea);
                  }
                } catch (error) {
                  toast.error('Failed to copy');
                }
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Prompt
                </Button>
                <Link href="/signup" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Your Own
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Footer Info */}
          <p className="text-center text-muted-foreground text-sm">
            This link expires in 7 days from creation
          </p>
        </div>
      </main>
    </div>
  );
}
