
export interface AIServiceResponse {
  text?: string;
  success?: boolean;
  error?: string;
  data?: {
    code?: {
      html: string;
      css: string;
      js: string;
    };
    explanation?: string;
  };
}

export interface AIRequestParams {
  prompt: string;
  chatHistory?: Array<{
    role: string;
    content: string;
  }>;
}

export interface AIClientOptions {
  apiKey: string | null;
  model?: string;
}

export interface AIClient {
  generateResponse(params: AIRequestParams): Promise<AIServiceResponse>;
  createEnhancedPrompt(prompt: string, chatHistory?: Array<{ role: string; content: string }>): string;
}

export abstract class BaseClient implements AIClient {
  protected apiKey: string | null = null;
  
  constructor(options: AIClientOptions) {
    this.apiKey = options.apiKey;
  }
  
  abstract generateResponse(params: AIRequestParams): Promise<AIServiceResponse>;
  
  createEnhancedPrompt(prompt: string, chatHistory?: Array<{ role: string; content: string }>): string {
    return `Generate a web application based on this description: ${prompt}`;
  }
  
  protected enhancePromptWithContext(prompt: string, additionalInfo?: any[]): string {
    return this.createEnhancedPrompt(prompt);
  }
  
  protected createEnhancedSystemPrompt(): string {
    return `You are a helpful AI assistant that specializes in web development. 
    Your task is to generate high-quality, functional HTML, CSS, and JavaScript code based on user requests.
    Provide well-commented, clean code that follows best practices.`;
  }
  
  protected formatChatHistory(history: Array<{ role: string; content: string }>): string {
    return history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  }
}

// Add the free API key constant
export const FREE_API_KEY = "demo-key-for-free-tier";
