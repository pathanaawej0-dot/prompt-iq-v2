export type Plan = 'spark' | 'architect' | 'studio';

export type Framework = 
  | 'chain-of-thought'
  | 'rice'
  | 'creative-brief'
  | 'star'
  | 'socratic'
  | 'custom';

export interface User {
  uid: string;
  email: string;
  name: string;
  plan: Plan;
  generations_used: number;
  generations_limit: number;
  created_at: Date;
  updated_at: Date;
  payment_history?: PaymentHistory[];
}

export interface PaymentHistory {
  order_id: string;
  amount: number;
  plan: Plan;
  date: Date;
  status: string;
}

export interface Prompt {
  id: string;
  user_id: string;
  input_text: string;
  output_text: string;
  framework: Framework;
  quality_score: number;
  version: number;
  parent_id: string | null;
  tokens_used: number;
  created_at: Date;
}

export interface SharedLink {
  id: string;
  prompt_id: string;
  expires_at: Date;
  created_at: Date;
}

export interface QualityBreakdown {
  structure: number;
  clarity: number;
  examples: number;
  specificity: number;
  total: number;
  suggestions: string[];
}

export interface GenerateResponse {
  output: string;
  qualityScore: QualityBreakdown;
}
