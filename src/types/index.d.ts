
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AIResponse {
  code: {
    html: string;
    css: string;
    js: string;
  };
  explanation: string;
  error?: string;
}

export type AIProvider = "PERPLEXITY" | "FREE";

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
}

export interface TemplateColors {
  blue: boolean;
  green: boolean;
  red: boolean;
  purple: boolean;
  dark: boolean;
  light: boolean;
}

export interface TemplateFeatures {
  responsive: boolean;
  animation: boolean;
  form: boolean;
  navigation: boolean;
}

export interface AIClientConfig {
  apiKey: string;
  provider: AIProvider;
  modelType?: string;
}

// Add license types
export interface License {
  type: "MIT" | "BSD" | "GPL" | "Apache" | "Custom";
  text: string;
  year: number;
  owner: string;
}
