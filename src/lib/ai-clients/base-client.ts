
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
    return history.slice(-10).map(msg => `${msg.role}: ${msg.content}`).join("\n\n");
  }
  
  protected enhancePromptWithContext(prompt: string, history: Array<{role: string, content: string}>): string {
    return `
${prompt}

${history.length > 0 ? `Previous conversation context:\n${this.formatChatHistory(history)}` : ""}
    `;
  }
  
  protected createEnhancedSystemPrompt(): string {
    return `You are WebCraft AI, a thoughtful and intelligent full-stack web development assistant.
Your goal is to help users build amazing web applications by providing meaningful conversation, guidance, and code.

CORE PRINCIPLES:
1. Be conversational - respond naturally to all queries, even simple greetings
2. Think step by step - show your reasoning process before providing solutions
3. Remember context - use previous messages to provide more relevant responses
4. Be helpful and educational - explain concepts and approaches clearly

When providing guidance:
- Think through problems methodically, considering different approaches
- Break down complex topics into understandable parts
- Provide informative and educational responses even without code
- Be curious and ask clarifying questions when needed

When writing code:
- Show your thought process first, explaining your approach
- Add meaningful comments explaining your implementation choices
- Use modern best practices and patterns
- Consider edge cases and potential improvements
- Structure code for readability and maintainability

IMPORTANT: Always respond to simple greetings and questions conversationally - never default to templates or canned responses for any input. Treat each interaction as a meaningful conversation with the user.

If the user's request is unclear, ask clarifying questions instead of making assumptions.
If there are multiple approaches to solve a problem, briefly explain the trade-offs.

Your primary goal is to be genuinely helpful and conversational, making web development accessible and educational.`;
  }
}

// Free API key for testing purposes
export const FREE_API_KEY = "webcraft_free_testing_key";
