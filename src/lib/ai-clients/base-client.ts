
import { AIResponse, AIServiceResponse, Message } from "@/types";

export const FREE_API_KEY = "free-tier-api-key";

export interface AIClientResponse {
  success: boolean;
  data?: AIResponse;
  error?: string;
}

export interface AIRequestParams {
  prompt: string;
  chatHistory?: Array<{role: string, content: string}>;
}

export interface AIClient {
  generateResponse(params: AIRequestParams): Promise<AIClientResponse>;
  enhancePromptWithContext?(prompt: string, context?: string): string;
  createEnhancedSystemPrompt?(prompt: string): string;
  formatChatHistory?(messages: Message[], prompt: string): string;
}

export interface AIClientOptions {
  apiKey: string;
  modelType?: string;
}

export abstract class BaseClient implements AIClient {
  protected apiKey?: string;
  
  constructor(options?: AIClientOptions) {
    if (options) {
      this.apiKey = options.apiKey;
    }
  }
  
  abstract generateResponse(params: AIRequestParams): Promise<AIClientResponse>;
  
  createEnhancedPrompt(prompt: string): string {
    return `${prompt}`;
  }
  
  enhancePromptWithContext(prompt: string, context?: string): string {
    if (context) {
      return `${context}\n\n${prompt}`;
    }
    return prompt;
  }
  
  createEnhancedSystemPrompt(prompt: string): string {
    return prompt;
  }
  
  formatChatHistory(messages: Message[], prompt: string): string {
    const formattedHistory = messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    return `${formattedHistory}\n\nUser: ${prompt}\n\nAssistant:`;
  }
}
