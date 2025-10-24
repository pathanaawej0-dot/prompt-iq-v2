'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FRAMEWORKS } from '@/lib/constants';
import { Framework, QualityBreakdown } from '@/types';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  qualityScore?: QualityBreakdown;
}

interface ProModeProps {
  userId: string;
  onGenerate: (input: string, framework: Framework, mode?: string, originalPrompt?: string) => Promise<{ output: string; qualityScore: QualityBreakdown }>;
}

export function ProMode({ userId, onGenerate }: ProModeProps) {
  const [framework, setFramework] = useState<Framework>('chain-of-thought');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      setLoading(true);
      
      // If this is the first message, generate new prompt
      // Otherwise, refine the last assistant message
      const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
      const mode = lastAssistantMessage ? 'refine' : 'generate';
      const originalPrompt = lastAssistantMessage?.content;

      const result = await onGenerate(
        input,
        framework,
        mode,
        originalPrompt
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: result.output,
        qualityScore: result.qualityScore,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success(mode === 'refine' ? 'Prompt refined!' : 'Prompt generated!');
    } catch (error: any) {
      console.error('Pro mode error:', error);
      toast.error(error.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
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

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Iterative Refinement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto p-4 rounded-lg border bg-muted/30">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center space-y-2">
                  <Bot className="h-12 w-12 mx-auto opacity-50" />
                  <p>Start a conversation to create and refine your prompt</p>
                  <p className="text-xs">Each message uses 1 generation credit</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="space-y-3">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        {message.qualityScore && (
                          <Badge variant="outline">
                            Quality: {message.qualityScore.total}/10
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder={
                messages.length === 0
                  ? "Describe your idea..."
                  : "Refine the prompt (e.g., 'make it shorter', 'add more examples')..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Press Cmd/Ctrl + Enter to send
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProMode;
