
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
      
      // Check if this is a conversation starter or greeting
      const simplifiedPrompt = prompt.toLowerCase().trim();
      if (this.isSimpleConversation(simplifiedPrompt)) {
        return this.handleConversation(simplifiedPrompt, chatHistory);
      }
      
      // For more complex requests, show a thinking process first
      const thinkingResponse = this.generateThinkingProcess(prompt, chatHistory);
      
      // Use the template generator system for code generation
      const response = await smartFallbackGenerator(prompt, chatHistory);
      
      // Enhance the response with better explanations and thinking process
      const enhancedExplanation = `${thinkingResponse}\n\n${this.enhanceExplanation(prompt, response.explanation || "")}`;
      
      return {
        success: true,
        data: {
          code: {
            html: response.code.html || "",
            css: response.code.css || "",
            js: response.code.js || ""
          },
          explanation: enhancedExplanation
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred in Free API mode" 
      };
    }
  }
  
  private isSimpleConversation(prompt: string): boolean {
    // Check for greetings and simple questions
    const conversationStarters = [
      "hello", "hi", "hey", "greetings", "howdy", 
      "what's up", "whats up", "sup", "yo", 
      "good morning", "good afternoon", "good evening",
      "help", "who are you", "what can you do", "how does this work"
    ];
    
    // Check for exact matches or starts with
    return conversationStarters.some(starter => 
      prompt === starter || 
      prompt.startsWith(`${starter} `) || 
      prompt.startsWith(`${starter},`) ||
      prompt.includes(starter)
    );
  }
  
  private handleConversation(prompt: string, history: Array<{role: string, content: string}>): AIServiceResponse {
    const isFirstMessage = history.filter(msg => msg.role === "user").length === 0;
    let response = "";
    
    // Handle greetings
    if (prompt.includes("hello") || prompt.includes("hi") || prompt.includes("hey") || prompt.includes("greetings")) {
      if (prompt.includes("morning")) {
        response = "Good morning! ";
      } else if (prompt.includes("afternoon")) {
        response = "Good afternoon! ";
      } else if (prompt.includes("evening")) {
        response = "Good evening! ";
      } else {
        response = "Hello there! ";
      }
      
      response += "I'm WebCraft AI, your full-stack web development assistant. ";
    }
    // Handle identity questions
    else if (prompt.includes("who are you") || prompt.includes("what are you")) {
      response = "I'm WebCraft AI, a development assistant designed to help you build web applications. ";
    }
    // Handle capability questions
    else if (prompt.includes("what can you do") || prompt.includes("how") || prompt.includes("help")) {
      response = "I can help you build web applications by generating code, answering questions, and providing guidance on development topics. ";
    }
    // Default response
    else {
      response = "I'm here to help with your web development needs. ";
    }
    
    // Add context based on conversation history
    if (isFirstMessage) {
      response += "I can help you create websites and web applications by writing HTML, CSS, and JavaScript code. What would you like to build today? You can describe a project, ask for specific features, or ask questions about web development concepts.";
    } else {
      response += "How can I assist you with your web development project today? Feel free to ask questions or describe what you'd like to build.";
    }
    
    return {
      success: true,
      data: {
        code: {
          html: "",
          css: "",
          js: ""
        },
        explanation: response
      }
    };
  }
  
  private generateThinkingProcess(prompt: string, history: Array<{role: string, content: string}>): string {
    // Create a more thoughtful and dynamic thinking process
    const thinkingSteps = ["I'm analyzing your request to build the best solution..."];
    
    // Add context from history
    if (history.length > 0) {
      const recentHistory = history.slice(-3);
      thinkingSteps.push("Based on our conversation so far, I'm considering how this new request fits with what we've discussed previously.");
    }
    
    // Add specific thinking steps based on prompt keywords
    if (prompt.toLowerCase().includes("landing") || prompt.toLowerCase().includes("home page")) {
      thinkingSteps.push("You're asking about a landing page. A good landing page needs:\n- An engaging hero section with a clear value proposition\n- Well-structured content sections that tell your story\n- Strategic call-to-action elements\n- Responsive design that works on all devices");
    }
    
    if (prompt.toLowerCase().includes("dashboard")) {
      thinkingSteps.push("This looks like a dashboard project. When building dashboards, I need to consider:\n- Information hierarchy and organization\n- Data visualization components that present information clearly\n- User interaction patterns for filtering and exploring data\n- Layout considerations for different screen sizes");
    }
    
    if (prompt.toLowerCase().includes("form") || prompt.toLowerCase().includes("contact")) {
      thinkingSteps.push("You need a form implementation. Important considerations include:\n- Input validation and user feedback\n- Accessible form design practices\n- Logical tab order and keyboard navigation\n- Appropriate input types and error handling");
    }
    
    if (prompt.toLowerCase().includes("responsive")) {
      thinkingSteps.push("Responsiveness is a key requirement. I'll approach this with:\n- Mobile-first design principles\n- Fluid layouts using Flexbox and/or CSS Grid\n- Strategic breakpoints for different device sizes\n- Responsive typography and image handling");
    }
    
    if (prompt.toLowerCase().includes("api") || prompt.toLowerCase().includes("data")) {
      thinkingSteps.push("This involves data or API integration. I need to consider:\n- Fetch or Axios for API requests\n- State management for loading, error, and success states\n- Proper error handling and user feedback\n- Data transformation and presentation");
    }
    
    // Add general closing thought
    thinkingSteps.push("Let me create a solution that's well-structured, maintainable, and follows modern best practices.");
    
    return thinkingSteps.join("\n\n");
  }
  
  private enhanceExplanation(prompt: string, originalExplanation: string): string {
    // Add more detailed implementation explanations if the original is too brief
    let enhancedExplanation = originalExplanation;
    
    if (enhancedExplanation.length < 100) {
      enhancedExplanation = `Based on your request for "${prompt.substring(0, 50)}...", I've created a web application solution.
      
Here's what I've implemented:

1. Created a responsive HTML structure with semantic markup for better accessibility and SEO
2. Added modern CSS styling using Tailwind utility classes for efficient styling
3. Implemented JavaScript functionality to handle user interactions and data management
4. Ensured the design works across different device sizes

The code follows modern web development best practices and provides a solid foundation that you can further customize to your specific needs.`;
    }
    
    return enhancedExplanation;
  }
}
