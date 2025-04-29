
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  html?: string;
  css?: string;
  js?: string;
  framework?: 'react' | 'vue' | 'vanilla';
  createdAt: number;
  updatedAt: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
}

export interface AIResponse {
  code: {
    html?: string;
    css?: string;
    js?: string;
  };
  explanation?: string;
  error?: string;
}

export interface AIServiceResponse {
  success: boolean;
  data?: AIResponse;
  error?: string;
}

export type AppView = 'chat' | 'preview' | 'code' | 'export';

export type AIProvider = 'OPENAI' | 'HUGGINGFACE' | 'PERPLEXITY';
