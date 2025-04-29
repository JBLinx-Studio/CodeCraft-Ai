
import { AIClient, AIClientOptions, AIRequestParams } from "./base-client";
import { AIServiceResponse } from "@/types";
import { smartFallbackGenerator } from "@/lib/template-generator";

export interface FreeClientOptions extends AIClientOptions {
  model?: string;
}

export class FreeAPIClient extends AIClient {
  private model: string;
  
  constructor(options: FreeClientOptions) {
    super(options);
    this.model = options.model || "free-test";
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory } = params;
      
      // Use the template generator system as a fallback for free API usage
      const response = await smartFallbackGenerator(prompt, chatHistory);
      
      return {
        success: true,
        data: {
          code: {
            html: response.code.html || "",
            css: response.code.css || "",
            js: response.code.js || ""
          },
          explanation: `${response.explanation || "Generated with Free API mode"}\n\n(Using free API mode for testing purposes. For production use, please consider using a paid API provider for better results.)`
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred in Free API mode" 
      };
    }
  }
}
