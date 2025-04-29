
import { AIServiceResponse } from "@/types";

export interface AIClientOptions {
  apiKey: string;
}

export interface AIRequestParams {
  prompt: string;
  chatHistory: Array<{role: string, content: string}>;
  options?: Record<string, any>;
}

export interface AIResponseFormatting {
  codeBlocks?: boolean;
  structuredOutput?: boolean;
  conversational?: boolean;
  detailedExplanations?: boolean;
}

export abstract class AIClient {
  protected apiKey: string;
  
  constructor(options: AIClientOptions) {
    this.apiKey = options.apiKey;
  }
  
  abstract generateResponse(params: AIRequestParams): Promise<AIServiceResponse>;
  
  protected formatChatHistory(history: Array<{role: string, content: string}>): string {
    return history.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join("\n");
  }
  
  protected enhancePromptWithContext(prompt: string, history: Array<{role: string, content: string}>): string {
    return `
${prompt}

${history.length > 0 ? `Previous conversation context:\n${this.formatChatHistory(history)}` : ""}
    `;
  }
}
