import { Timestamp } from 'firebase/firestore';
import { Plan, Framework } from './index';

export interface UserDocument {
  uid: string;
  email: string;
  name: string;
  plan: Plan;
  generations_used: number;
  generations_limit: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  payment_history?: PaymentHistoryDocument[];
}

export interface PaymentHistoryDocument {
  order_id: string;
  amount: number;
  plan: Plan;
  date: Timestamp;
  status: string;
}

export interface PromptDocument {
  id: string;
  user_id: string;
  input_text: string;
  output_text: string;
  framework: Framework;
  quality_score: number;
  version: number;
  parent_id: string | null;
  tokens_used: number;
  created_at: Timestamp;
}

export interface SharedLinkDocument {
  id: string;
  prompt_id: string;
  expires_at: Timestamp;
  created_at: Timestamp;
}
