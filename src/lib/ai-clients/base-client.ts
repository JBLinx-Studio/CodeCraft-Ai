
import { AIResponse, AIServiceResponse, Message } from "@/types";

export interface AIClient {
  generateResponse(prompt: string): Promise<AIServiceResponse>;
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
  
  abstract generateResponse(prompt: string): Promise<AIServiceResponse>;
  
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
