
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

export interface AIClientOptions {
  apiKey: string;
  modelType?: string;
}

export interface AIServiceResponse {
  text: string;
  success?: boolean;
  data?: AIResponse;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
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
