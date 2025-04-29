
import { AIServiceResponse } from "@/types";

export interface AIClientOptions {
  apiKey: string;
}

export interface AIRequestParams {
  prompt: string;
  chatHistory: Array<{role: string, content: string}>;
  options?: Record<string, any>;
}

export abstract class AIClient {
  protected apiKey: string;
  
  constructor(options: AIClientOptions) {
    this.apiKey = options.apiKey;
  }
  
  abstract generateResponse(params: AIRequestParams): Promise<AIServiceResponse>;
}
