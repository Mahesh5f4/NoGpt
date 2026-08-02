export type ToneOption = 
  | 'Friendly'
  | 'Professional'
  | 'Assertive'
  | 'Respectful'
  | 'Firm'
  | 'Empathetic'
  | 'Confident'
  | 'Direct';

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface QuickChip {
  id: string;
  label: string;
  category: string;
  promptText: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tone?: ToneOption;
  timestamp: number;
  isStreaming?: boolean;
  error?: string;
  confidenceScore?: number;
  communicationTip?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  tone: ToneOption;
  category?: string;
  pinned?: boolean;
}

export interface GenerationParams {
  situation: string;
  tone: ToneOption;
  language: string;
}
