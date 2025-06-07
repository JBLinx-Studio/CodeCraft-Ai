
import { BaseClient, AIServiceResponse, AIRequestParams, AIClientOptions } from "./base-client";
import { puterService } from "@/services/puter-service";

export interface PuterClientOptions extends AIClientOptions {
  model?: string;
}

export class PuterClient extends BaseClient {
  constructor(options: PuterClientOptions) {
    super(options);
  }

  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory } = params;
      
      console.log("Using Puter.js AI for code generation...");
      
      const response = await puterService.generateCode(prompt, chatHistory);
      
      if (response.success && response.code) {
        return {
          success: true,
          data: {
            code: response.code,
            explanation: response.explanation || "Generated with Puter.js AI"
          }
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to generate code with Puter.js"
        };
      }
    } catch (error) {
      console.error("Puter AI error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Puter AI error"
      };
    }
  }

  createEnhancedPrompt(prompt: string, chatHistory?: Array<{ role: string; content: string }>): string {
    let enhancedPrompt = `As a professional fullstack web developer, create a complete web application for: ${prompt}
    
Requirements:
- Generate clean, modern, responsive code
- Include proper HTML structure, CSS styling, and JavaScript functionality
- Make it fully interactive and professional
- Use modern web development best practices
- Ensure cross-browser compatibility`;

    if (chatHistory && chatHistory.length > 0) {
      const context = chatHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n');
      enhancedPrompt += `\n\nContext from previous conversation:\n${context}`;
    }

    return enhancedPrompt;
  }
}
