import { Framework, Plan } from '@/types';

export const PLAN_LIMITS: Record<Plan, number> = {
  spark: 30,
  architect: 500,
  studio: 2500,
};

export const PLAN_PRICES: Record<Plan, number> = {
  spark: 0,
  architect: 299,
  studio: 999,
};

export const PLAN_FEATURES: Record<Plan, string[]> = {
  spark: [
    '30 prompts/month',
    'Quick Mode only',
    'Basic frameworks',
    'Standard quality',
  ],
  architect: [
    '500 prompts/month',
    'Quick + Pro Mode',
    'All frameworks',
    'Priority quality',
    'Version history (10 versions)',
    'Export to PDF',
    'Email support',
  ],
  studio: [
    '2,500 prompts/month',
    'Everything in Architect',
    'Unlimited version history',
    'Team collaboration (coming soon)',
    'Priority support',
    'Custom frameworks',
    'API access (coming soon)',
  ],
};

export const FRAMEWORKS: Record<Framework, { name: string; description: string }> = {
  'chain-of-thought': {
    name: 'Chain of Thought',
    description: 'Step-by-step reasoning structure for complex problems',
  },
  'rice': {
    name: 'RICE Framework',
    description: 'Reach, Impact, Confidence, Effort prioritization',
  },
  'creative-brief': {
    name: 'Creative Brief',
    description: 'Brand voice, target audience, key messages',
  },
  'star': {
    name: 'STAR Method',
    description: 'Situation, Task, Action, Result structure',
  },
  'socratic': {
    name: 'Socratic Questioning',
    description: 'Guided thinking through strategic questions',
  },
  'custom': {
    name: 'Custom',
    description: 'Define your own structure',
  },
};

export const LOADING_MESSAGES = [
  'Crafting legendary prompts...',
  'Analyzing best frameworks...',
  'Polishing the output...',
  'Optimizing for clarity...',
  'Adding professional touches...',
];

export const PRO_TIPS = [
  'Be specific about your target audience',
  'Include desired output format',
  'Add constraints and limitations',
  'Mention success criteria',
  'Provide context and background',
  'Include relevant examples',
  'Define the tone and style',
  'Specify technical requirements',
];
