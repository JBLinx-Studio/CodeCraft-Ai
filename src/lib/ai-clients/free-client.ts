
import { AIClient, AIClientOptions, AIRequestParams } from "./base-client";
import { AIServiceResponse } from "@/types";
import { extractCodeBlocks } from "@/lib/utils";

export interface FreeClientOptions extends AIClientOptions {
  model?: string;
}

export class FreeAPIClient extends AIClient {
  private model: string;
  private isProcessingRequest: boolean = false;
  
  constructor(options: FreeClientOptions) {
    super(options);
    this.model = options.model || "meta-llama/Meta-Llama-3-8B-Instruct";
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory } = params;
      this.isProcessingRequest = true;
      
      // Check if this is a simple conversation starter (greeting)
      const simplifiedPrompt = prompt.toLowerCase().trim();
      if (this.isSimpleConversation(simplifiedPrompt)) {
        return this.handleConversation(simplifiedPrompt, chatHistory);
      }
      
      // Create a conversation-style prompt with history context
      const messages = this.formatMessagesForLLM(prompt, chatHistory);
      
      try {
        // Try Hugging Face Inference API (free tier)
        const response = await this.callHuggingFaceAPI(messages);
        if (response && response.success) {
          return response;
        }
      } catch (error) {
        console.error("Error with HuggingFace API:", error);
        // Fall back to local processing if API fails
      }
      
      // Fallback: Create a more thoughtful response locally
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
  
  private async callHuggingFaceAPI(messages: any[]): Promise<AIServiceResponse> {
    try {
      // Format the prompt for the Hugging Face API
      const formattedMessages = messages.map(msg => {
        if (msg.role === "system") return `<|system|>\n${msg.content}\n`;
        if (msg.role === "user") return `<|user|>\n${msg.content}\n`;
        if (msg.role === "assistant") return `<|assistant|>\n${msg.content}\n`;
        return `${msg.role}: ${msg.content}\n`;
      }).join("");
      
      const finalPrompt = `${formattedMessages}<|assistant|>\n`;
      
      // Call the Hugging Face Inference API (free tier)
      const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: finalPrompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = data[0]?.generated_text || "";
      
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
      console.error("Error calling Hugging Face API:", error);
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
  
  private createLocalResponse(prompt: string, history: Array<{role: string, content: string}>): AIServiceResponse {
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
}
