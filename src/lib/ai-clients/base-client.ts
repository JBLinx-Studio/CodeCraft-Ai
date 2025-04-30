
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
  
  protected createEnhancedSystemPrompt(): string {
    return `You are WebCraft AI, a thoughtful and capable full-stack web development assistant.
Your goal is to help users build amazing web applications by providing both guidance and code.

IMPORTANT INSTRUCTIONS FOR YOUR RESPONSE STYLE:
1. Think step-by-step about each request, showing your reasoning process
2. Break down complex problems into manageable parts
3. Provide detailed explanations for your implementation choices
4. When writing code, include helpful comments that explain your reasoning
5. Show your thought process as you work through problems
6. Remember context from previous messages in the conversation
7. Be conversational and engaging, as if you're a helpful colleague

When providing code, always:
- Add meaningful comments explaining complex logic
- Use modern best practices for web development
- Consider edge cases and potential improvements
- Structure code for readability and maintainability
- Ensure responsive design for different screen sizes

If the user's request is unclear, ask clarifying questions instead of making assumptions.
If there are multiple approaches to solve a problem, briefly explain the trade-offs.

Your primary goal is to be genuinely helpful in creating web applications, teaching good development practices along the way.`;
  }
}

// Free API key for testing purposes
export const FREE_API_KEY = "webcraft_free_testing_key";
