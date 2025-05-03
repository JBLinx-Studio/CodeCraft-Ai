
import { type } from "os";

export interface AIResponse {
  code: {
    html: string;
    css: string;
    js: string;
  };
  explanation?: string;
  error?: string;
}

export type AIProvider = "PERPLEXITY" | "FREE" | "OPENAI" | "HUGGINGFACE";

export interface AIClientConfig {
  apiKey: string;
  provider: AIProvider;
  modelType?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  code?: {
    html: string;
    css: string;
    js: string;
  };
}
