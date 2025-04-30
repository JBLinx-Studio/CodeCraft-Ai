
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
      
      // For very simple greetings and small talk, provide a direct conversational response
      const simplifiedPrompt = prompt.toLowerCase().trim();
      if (this.isSimpleGreeting(simplifiedPrompt)) {
        return this.handleSimpleGreeting(simplifiedPrompt, chatHistory);
      }
      
      // Show thinking process for more complex requests
      const thinkingResponse = this.generateThinkingResponse(prompt);
      
      // Use the template generator system as a fallback for free API usage
      const response = await smartFallbackGenerator(prompt, chatHistory);
      
      // Enhance the response with better explanations
      const enhancedExplanation = this.enhanceExplanation(prompt, response.explanation || "");
      
      return {
        success: true,
        data: {
          code: {
            html: response.code.html || "",
            css: response.code.css || "",
            js: response.code.js || ""
          },
          explanation: `${thinkingResponse}\n\n${enhancedExplanation}\n\n(Using free API mode for testing purposes. For production use, please consider using a paid API provider for better results.)`
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred in Free API mode" 
      };
    }
  }
  
  private isSimpleGreeting(prompt: string): boolean {
    const greetings = [
      "hello", "hi", "hey", "greetings", "howdy", 
      "what's up", "whats up", "sup", "yo", 
      "good morning", "good afternoon", "good evening"
    ];
    
    return greetings.some(greeting => 
      prompt === greeting || 
      prompt.startsWith(`${greeting} `) || 
      prompt.startsWith(`${greeting},`)
    );
  }
  
  private handleSimpleGreeting(prompt: string, history: Array<{role: string, content: string}>): AIServiceResponse {
    const isFirstMessage = history.filter(msg => msg.role === "user").length === 0;
    
    let greeting = "Hello! I'm WebCraft AI, your full-stack web development assistant. ";
    
    if (prompt.includes("morning")) {
      greeting = "Good morning! I'm WebCraft AI, ready to help with your web development projects. ";
    } else if (prompt.includes("afternoon")) {
      greeting = "Good afternoon! I'm WebCraft AI, excited to assist with your web development needs. ";
    } else if (prompt.includes("evening")) {
      greeting = "Good evening! I'm WebCraft AI, here to help with your web development tasks. ";
    }
    
    let message = "";
    
    if (isFirstMessage) {
      message = `${greeting}I can help you build amazing web applications by providing both guidance and code. What would you like to create today? You can describe a project, ask for specific features, or let me know if you have any questions about web development.`;
    } else {
      message = `${greeting}I'm here to continue helping with your web development project. What would you like to work on next?`;
    }
    
    return {
      success: true,
      data: {
        code: {
          html: "",
          css: "",
          js: ""
        },
        explanation: message
      }
    };
  }
  
  private generateThinkingResponse(prompt: string): string {
    // Generate a "thinking out loud" response to show reasoning process
    const thinkingSteps = [
      "I'm analyzing your request to build the best solution...",
      "Let me think about how to approach this..."
    ];
    
    // Add specific thinking steps based on prompt keywords
    if (prompt.toLowerCase().includes("landing")) {
      thinkingSteps.push("This sounds like a landing page project. I should focus on creating an engaging hero section, clear call-to-actions, and compelling content sections.");
    }
    
    if (prompt.toLowerCase().includes("dashboard")) {
      thinkingSteps.push("You're looking for a dashboard. This will need data visualization components, a clean layout for information hierarchy, and responsive design for different screen sizes.");
    }
    
    if (prompt.toLowerCase().includes("form") || prompt.toLowerCase().includes("contact")) {
      thinkingSteps.push("I notice you need a form implementation. I'll need to consider form validation, user feedback, and proper input field design.");
    }
    
    if (prompt.toLowerCase().includes("responsive")) {
      thinkingSteps.push("Responsiveness is important here. I'll make sure to implement fluid layouts and media queries to ensure the design works on all devices.");
    }
    
    // Add general thinking steps
    thinkingSteps.push("I'll create a solution that follows modern web development best practices with clean, maintainable code.");
    
    return thinkingSteps.join("\n\n");
  }
  
  private enhanceExplanation(prompt: string, originalExplanation: string): string {
    // Add more detailed implementation explanations
    let enhancedExplanation = originalExplanation;
    
    if (enhancedExplanation.length < 100) {
      enhancedExplanation = `Based on your request for "${prompt.substring(0, 50)}...", I've created a web application that meets your needs.
      
Here's how I implemented the solution:

1. Created a responsive HTML structure with semantic markup
2. Added modern CSS styling with Tailwind utility classes
3. Implemented JavaScript functionality to handle user interactions
4. Ensured the design is accessible and works on all device sizes

This implementation follows modern web development best practices and provides a solid foundation that you can further customize.`;
    }
    
    return enhancedExplanation;
  }
}
