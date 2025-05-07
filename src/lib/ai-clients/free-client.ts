
import { AIClientResponse, BaseClient, AIRequestParams } from "./base-client";
import { smartFallbackGenerator } from "../template-generator";

export class FreeClient extends BaseClient {
  async generateResponse(params: AIRequestParams): Promise<AIClientResponse> {
    try {
      const { prompt, chatHistory = [] } = params;
      
      const response = await smartFallbackGenerator(prompt, chatHistory);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}
