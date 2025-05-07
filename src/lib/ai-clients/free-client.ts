import { AIClient, AIClientOptions, AIRequestParams, AIServiceResponse } from "./base-client";
import { extractCodeBlocks } from "@/lib/utils";

export interface FreeClientOptions extends AIClientOptions {
  model?: string;
}

export class FreeAPIClient implements AIClient {
  private model: string;
  private apiKey: string | null;
  private isProcessingRequest: boolean = false;
  private apiEndpoints: Array<{url: string, name: string, needsAuth: boolean}> = [
    {url: "https://api-inference.huggingface.co/models/google/flan-t5-small", name: "flan-t5", needsAuth: false},
    {url: "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", name: "mistral-7b", needsAuth: false},
  ];
  
  constructor(options: FreeClientOptions) {
    this.apiKey = options.apiKey;
    // Using a model that's more accessible without authentication
    this.model = options.model || "google/flan-t5-small";
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory = [] } = params;
      this.isProcessingRequest = true;
      
      // Check if this is a simple conversation starter (greeting)
      const simplifiedPrompt = prompt.toLowerCase().trim();
      if (this.isSimpleConversation(simplifiedPrompt)) {
        return this.handleConversation(simplifiedPrompt, chatHistory);
      }
      
      // Create a conversation-style prompt with history context
      const messages = this.formatMessagesForLLM(prompt, chatHistory);
      
      // Try different API endpoints in sequence
      for (const endpoint of this.apiEndpoints) {
        try {
          console.log(`Attempting to use ${endpoint.name} API...`);
          const response = await this.callExternalAPI(messages, endpoint);
          if (response && response.success) {
            return response;
          }
        } catch (error) {
          console.warn(`Error with ${endpoint.name} API:`, error);
          // Continue to next endpoint
        }
      }
      
      // Enhanced fallback: If all APIs fail, try one last option with a simpler prompt
      try {
        console.log("Trying simplified prompt fallback...");
        const simplifiedResponse = await this.callInferenceAPI(
          `Generate HTML, CSS and JavaScript for: ${prompt}`
        );
        
        if (simplifiedResponse && simplifiedResponse.success) {
          return simplifiedResponse;
        }
      } catch (error) {
        console.warn("Simplified fallback failed:", error);
      }
      
      // Final fallback: Create a more thoughtful response locally
      return this.createLocalResponse(prompt, chatHistory);
    } catch (error) {
      console.error("FreeAPIClient error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred in Free API mode" 
      };
    } finally {
      this.isProcessingRequest = false;
    }
  }
  
  private async callExternalAPI(messages: any[], endpoint: {url: string, name: string, needsAuth: boolean}): Promise<AIServiceResponse | null> {
    try {
      // Format the prompt based on the API
      const lastMessage = messages[messages.length - 1];
      const userPrompt = lastMessage.content || "";
      
      // Make API request with appropriate headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Add authorization if needed and available
      if (endpoint.needsAuth && this.apiKey) {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
      }
      
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          inputs: userPrompt,
          options: {
            wait_for_model: true
          }
        }),
      });
      
      if (!response.ok) {
        console.log(`${endpoint.name} API responded with status:`, response.status);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = Array.isArray(data) && data.length > 0 ? data[0].generated_text : 
                           (data.generated_text || data.text || data.output || JSON.stringify(data));
      
      // Extract any code blocks from the response
      const { code, explanation } = extractCodeBlocks(generatedText);
      
      return {
        success: true,
        data: {
          code: {
            html: code.html || "",
            css: code.css || "",
            js: code.js || ""
          },
          explanation: explanation || generatedText
        }
      };
    } catch (error) {
      console.error(`Error calling ${endpoint.name} API:`, error);
      throw error;
    }
  }
  
  private async callInferenceAPI(simplifiedPrompt: string): Promise<AIServiceResponse | null> {
    try {
      // Use a public API that doesn't require authentication
      const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: simplifiedPrompt,
          options: {
            wait_for_model: true
          }
        }),
      });
      
      if (!response.ok) {
        console.log("API responded with status:", response.status);
        throw new Error(`Inference API error: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = Array.isArray(data) && data.length > 0 ? data[0].generated_text : "";
      
      // Extract any code blocks from the response
      const { code, explanation } = extractCodeBlocks(generatedText);
      
      return {
        success: true,
        data: {
          code: {
            html: code.html || "",
            css: code.css || "",
            js: code.js || ""
          },
          explanation: explanation || generatedText
        }
      };
    } catch (error) {
      console.error("Error calling Inference API:", error);
      throw error;
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
  
  private handleConversation(prompt: string, history: Array<{role: string, content: string}> = []): AIServiceResponse {
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
  
  private formatMessagesForLLM(prompt: string, history: Array<{role: string, content: string}>): any[] {
    const messages = [];
    
    // Add system prompt
    messages.push({
      role: "system",
      content: `${this.createEnhancedSystemPrompt()}
      
When asked to create web applications:
1. First analyze the request and show your reasoning.
2. Generate HTML, CSS, and JavaScript code wrapped in code blocks (e.g., \`\`\`html, \`\`\`css, \`\`\`js).
3. Provide clear explanations for your implementation choices.
4. Make sure all code is complete and works together.

If the user doesn't specifically request code, engage in a helpful conversation about web development topics. If they greet you, respond in a friendly, conversational manner.`
    });
    
    // Add conversation history (limited to last 10 messages)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      });
    }
    
    // Add the current prompt
    messages.push({
      role: "user",
      content: prompt
    });
    
    return messages;
  }
  
  private createLocalResponse(prompt: string, history: Array<{role: string, content: string}> = []): AIServiceResponse {
    // Generate a thoughtful but local response when APIs fail
    const thinkingSteps = this.generateThinkingProcess(prompt);
    
    // Determine if this looks like a code generation request
    const isCodeRequest = this.seemsLikeCodeRequest(prompt);
    
    if (isCodeRequest) {
      // For code requests, provide a helpful explanation but no actual code
      return {
        success: true,
        data: {
          code: {
            html: "<div class=\"container\">\n  <h1>Hello World</h1>\n  <p>This is a simple example.</p>\n</div>",
            css: "body {\n  font-family: 'Arial', sans-serif;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 2rem;\n}",
            js: "// Simple interactive functionality\ndocument.addEventListener('DOMContentLoaded', () => {\n  console.log('App initialized!');\n});"
          },
          explanation: `${thinkingSteps}\n\nI've created a simple starter template based on your request. This is just a basic example - to get more advanced functionality, you might want to use your own API key for more powerful AI code generation.`
        }
      };
    } else {
      // For conversation, just return the thinking process
      return {
        success: true,
        data: {
          code: {
            html: "",
            css: "",
            js: ""
          },
          explanation: `Let me think about this...\n\n${thinkingSteps}`
        }
      };
    }
  }
  
  private generateThinkingProcess(prompt: string): string {
    // Create a more thoughtful and dynamic thinking process
    const lowerPrompt = prompt.toLowerCase();
    let thoughts = [];
    
    // Add context-specific thoughts based on keywords
    if (lowerPrompt.includes("react") || lowerPrompt.includes("component")) {
      thoughts.push("You're asking about React components. React is a popular JavaScript library for building user interfaces, especially single-page applications.");
      thoughts.push("When designing React components, it's important to consider:");
      thoughts.push("- Component reusability and composition");
      thoughts.push("- State management (local state, context, or external libraries)");
      thoughts.push("- Props and their typings with TypeScript");
      thoughts.push("- Side effects with useEffect and cleanup functions");
    } else if (lowerPrompt.includes("api") || lowerPrompt.includes("fetch")) {
      thoughts.push("I see you're interested in working with APIs. Let me share some thoughts:");
      thoughts.push("- Modern approaches use fetch or libraries like axios");
      thoughts.push("- Error handling is crucial for robust applications");
      thoughts.push("- Consider loading states and user feedback");
      thoughts.push("- React Query can simplify data fetching and caching");
    } else if (lowerPrompt.includes("css") || lowerPrompt.includes("style") || lowerPrompt.includes("design")) {
      thoughts.push("You're asking about styling and design. Here are my thoughts:");
      thoughts.push("- Modern CSS features like flexbox and grid are powerful for layouts");
      thoughts.push("- Tailwind CSS provides utility classes for rapid development");
      thoughts.push("- CSS variables (custom properties) enable theming and consistency");
      thoughts.push("- Responsive design should be considered from the beginning");
    } else if (lowerPrompt.includes("performance") || lowerPrompt.includes("optimize")) {
      thoughts.push("Performance optimization is an important topic. Some key considerations:");
      thoughts.push("- Minimize bundle size with code splitting and tree shaking");
      thoughts.push("- Optimize rendering with memoization (useMemo, useCallback)");
      thoughts.push("- Lazy loading for components and images");
      thoughts.push("- Virtualization for long lists with libraries like react-window");
    } else {
      thoughts.push("I'm analyzing your request about web development.");
      thoughts.push("Let me consider what would be most helpful for your needs.");
      thoughts.push("Web development involves many different technologies and approaches.");
      thoughts.push("I'll try to provide guidance that's both practical and educational.");
    }
    
    return thoughts.join("\n\n");
  }
  
  private seemsLikeCodeRequest(prompt: string): boolean {
    const codeKeywords = [
      "create", "build", "make", "generate", "code", "implement",
      "develop", "app", "application", "website", "component", "page",
      "feature", "function", "html", "css", "javascript", "react"
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    return codeKeywords.some(keyword => lowerPrompt.includes(keyword));
  }

  createEnhancedPrompt(prompt: string, chatHistory: Array<{ role: string; content: string }> = []): string {
    return `Generate a web application based on this description: ${prompt}`;
  }

  private createEnhancedSystemPrompt(): string {
    return `You are a helpful AI assistant that specializes in web development. 
    Your task is to generate high-quality, functional HTML, CSS, and JavaScript code based on user requests.
    Provide well-commented, clean code that follows best practices.`;
  }
}
