'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePrompts } from '@/hooks/usePrompts';
import { Navbar } from '@/components/shared/Navbar';
import { LoadingPage, SkeletonCard } from '@/components/shared/LoadingStates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FRAMEWORKS } from '@/lib/constants';
import { Copy, Trash2, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import { Prompt } from '@/types';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { prompts, loading: promptsLoading, refreshPrompts } = usePrompts(user?.uid);
  const [searchQuery, setSearchQuery] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
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
  };

  const handleDelete = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      const response = await fetch('/api/prompts/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId,
          userId: user?.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete prompt');
      }

      toast.success('Prompt deleted');
      refreshPrompts();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete prompt');
    }
  };

  const handleView = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setDialogOpen(true);
  };

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.output_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = frameworkFilter === 'all' || prompt.framework === frameworkFilter;
    return matchesSearch && matchesFramework;
  });

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prompt History</h1>
          <p className="text-muted-foreground">View and manage all your generated prompts</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  {Object.entries(FRAMEWORKS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Prompts List */}
        {promptsLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || frameworkFilter !== 'all'
                  ? 'No prompts found matching your filters'
                  : 'No prompts yet. Start creating in the dashboard!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-1">{prompt.input_text}</CardTitle>
                      <CardDescription className="line-clamp-2">{prompt.output_text}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      {FRAMEWORKS[prompt.framework]?.name || prompt.framework}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Quality: {prompt.quality_score}/10</span>
                      <span>•</span>
                      <span>{format(prompt.created_at, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(prompt)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(prompt.output_text)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(prompt.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prompt Details</DialogTitle>
              <DialogDescription>
                {selectedPrompt && format(selectedPrompt.created_at, 'MMMM d, yyyy at h:mm a')}
              </DialogDescription>
            </DialogHeader>
            {selectedPrompt && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Input:</h4>
                  <p className="text-sm text-muted-foreground">{selectedPrompt.input_text}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Generated Prompt:</h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-lg border bg-muted/50">
                    <ReactMarkdown>{selectedPrompt.output_text}</ReactMarkdown>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">{FRAMEWORKS[selectedPrompt.framework]?.name}</Badge>
                    <span className="text-muted-foreground">Quality: {selectedPrompt.quality_score}/10</span>
                  </div>
                  <Button onClick={() => handleCopy(selectedPrompt.output_text)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Prompt
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
