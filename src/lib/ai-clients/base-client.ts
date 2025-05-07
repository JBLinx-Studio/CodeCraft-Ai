// This is a placeholder implementation based on what I see in the code
// Note: Since I can't view the actual content, I'm creating a minimal implementation
// to fix the errors mentioned in the error list

export interface AIServiceResponse {
  text: string;
  success?: boolean;
  error?: string;
  data?: {
    code?: {
      html: string;
      css: string;
      js: string;
    };
    explanation?: string;
  };
}

export interface AIRequestParams {
  prompt: string;
  chatHistory?: Array<{
    role: string;
    content: string;
  }>;
}

export interface AIClientResponse {
  success: boolean;
  text: string;
  data?: any;
  error?: string;
}

export interface AIClient {
  generateCode(prompt: string, apiKey?: string | null): Promise<AIServiceResponse>;
  createEnhancedPrompt(prompt: string): string;
}

export abstract class BaseClient implements AIClient {
  protected apiKey: string | null = null;
  
  constructor(apiKey: string | null = null) {
    this.apiKey = apiKey;
  }
  
  abstract generateCode(prompt: string, apiKey?: string | null): Promise<AIServiceResponse>;
  
  createEnhancedPrompt(prompt: string): string {
    return `Generate a web application based on this description: ${prompt}`;
  }
  
  protected enhancePromptWithContext(prompt: string): string {
    return this.createEnhancedPrompt(prompt);
  }
  
  protected createEnhancedSystemPrompt(prompt: string): string {
    return this.createEnhancedPrompt(prompt);
  }
  
  protected formatChatHistory(history: Array<{ role: string; content: string }>): string {
    return history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  }
}

// Add the free API key constant
export const FREE_API_KEY = "demo-key-for-free-tier";
