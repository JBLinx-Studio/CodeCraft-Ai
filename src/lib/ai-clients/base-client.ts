
import { AIResponse } from "@/types";

export const FREE_API_KEY = "free-tier-api-key";

export interface AIClientResponse {
  success: boolean;
  data?: AIResponse;
  error?: string;
}

export interface AIRequestParams {
  prompt: string;
  chatHistory: Array<{role: string, content: string}>;
}

export abstract class BaseClient {
  abstract generateResponse(params: AIRequestParams): Promise<AIClientResponse>;
}
