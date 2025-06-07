
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AIResponse {
  code?: {
    html: string;
    css: string;
    js: string;
  };
  explanation?: string;
  error?: string;
}

export type AIProvider = "OPENAI" | "HUGGINGFACE" | "PERPLEXITY" | "FREE";

export interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  html: string;
  css: string;
  js: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
}
