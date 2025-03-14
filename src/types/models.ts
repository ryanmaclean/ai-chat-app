export interface ModelProvider {
  id: string;
  name: string;
  models: Model[];
}

export interface Model {
  id: string;
  name: string;
  contextSize: number;
  costPer1kTokensInput: number;
  costPer1kTokensOutput: number;
  maxTemperature: number;
}

export interface ModelParams {
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  tokensUsed?: number;
  cost?: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
} 