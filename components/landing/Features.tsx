'use client';

import { motion } from 'framer-motion';
import { Zap, Target, Lightbulb, BarChart3, History, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Generation',
    description: 'Transform any idea into a detailed prompt in seconds. Powered by Gemini 2.5 Flash for instant results.',
  },
  {
    icon: Target,
    title: 'Professional Frameworks',
    description: 'Chain of Thought, RICE, STAR, Creative Brief, and more. Industry-standard structures at your fingertips.',
  },
  {
    icon: Lightbulb,
    title: 'Hybrid Interface',
    description: 'Quick Mode for instant results. Pro Mode for iterative refinement. Choose your workflow.',
  },
  {
    icon: BarChart3,
    title: 'Quality Scoring',
    description: 'AI-powered analysis of prompt quality with instant suggestions for improvement.',
  },
  {
    icon: History,
    title: 'Version Control',
    description: 'Track every iteration. Compare and restore previous versions. Never lose your work.',
  },
  {
    icon: Share2,
    title: 'Export Anywhere',
    description: 'PDF, Notion, Share Links, Twitter. Export your prompts to fit your workflow.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            Everything You Need to Create{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Perfect Prompts
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Powerful features designed for professionals who demand the best
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
