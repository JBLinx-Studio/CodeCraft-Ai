
import { AIClient, AIClientOptions, AIRequestParams, AIServiceResponse } from "./base-client";

export const PERPLEXITY_MODELS = {
  SMALL: "llama-3.1-sonar-small-128k-online",
  LARGE: "llama-3.1-sonar-large-128k-online",
  HUGE: "llama-3.1-sonar-huge-128k-online"
};

export interface PerplexityClientOptions extends AIClientOptions {
  model?: keyof typeof PERPLEXITY_MODELS | string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class PerplexityClient implements AIClient {
  private model: string;
  private apiKey: string | null;
  
  constructor(options: PerplexityClientOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model 
      ? (typeof options.model === 'string' && options.model in PERPLEXITY_MODELS 
          ? PERPLEXITY_MODELS[options.model as keyof typeof PERPLEXITY_MODELS]
          : options.model as string)
      : PERPLEXITY_MODELS.SMALL;
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory = [] } = params;
      
      // Check if this is a simple conversation rather than a code request
      if (this.isSimpleConversation(prompt)) {
        return this.handleConversation(prompt, chatHistory);
      }
      
      const systemMessage = `${this.createEnhancedSystemPrompt()}

When responding to the user's web development request, follow this structure:

1. First, share your Thinking Process - analyze the request thoroughly, consider different approaches, and show your reasoning step by step.

2. For code solutions, structure your response with clear code blocks:
{
  "html": "<!-- Complete HTML code with helpful comments -->",
  "css": "/* Complete CSS code with organization and comments */",
  "js": "// Complete JavaScript code with detailed comments",
  "explanation": "Detailed explanation of your implementation approach, key decisions, and how components work together"
}

3. If the user is asking a question rather than requesting code, provide an educational and thorough explanation that helps them understand the concept deeply.

Make your response conversational, educational, and practical - as if you're a helpful colleague working through the problem together.`;

      const request = {
        model: this.model,
        messages: [
          { role: "system", content: systemMessage },
          ...chatHistory.slice(-10), // Include more context from previous messages
          { role: "user", content: prompt }
        ],
        temperature: 0.7, // Increased for more creative/diverse responses
        top_p: 0.9,
        max_tokens: 4000
      };
      
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return { 
          success: false, 
          error: `API responded with status ${response.status}: ${errorText}` 
        };
      }
      
      const data: PerplexityResponse = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  }
  
  private isSimpleConversation(prompt: string): boolean {
    const simplifiedPrompt = prompt.toLowerCase().trim();
    
    // Check for greetings and simple questions
    const conversationStarters = [
      "hello", "hi", "hey", "greetings", "howdy", 
      "what's up", "whats up", "sup", "yo", 
      "good morning", "good afternoon", "good evening",
      "help", "who are you", "what can you do", "how does this work"
    ];
    
    // Check for exact matches or starts with
    return conversationStarters.some(starter => 
      simplifiedPrompt === starter || 
      simplifiedPrompt.startsWith(`${starter} `) || 
      simplifiedPrompt.startsWith(`${starter},`) ||
      simplifiedPrompt.includes(starter)
    );
  }
  
  private handleConversation(prompt: string, history: Array<{role: string, content: string}> = []): AIServiceResponse {
    const isFirstMessage = history.filter(msg => msg.role === "user").length === 0;
    const simplifiedPrompt = prompt.toLowerCase().trim();
    let response = "";
    
    // Handle different types of conversational prompts
    if (simplifiedPrompt.includes("hello") || simplifiedPrompt.includes("hi") || 
        simplifiedPrompt.includes("hey") || simplifiedPrompt.includes("greetings")) {
      // Handle time-based greetings
      if (simplifiedPrompt.includes("morning")) {
        response = "Good morning! ";
      } else if (simplifiedPrompt.includes("afternoon")) {
        response = "Good afternoon! ";
      } else if (simplifiedPrompt.includes("evening")) {
        response = "Good evening! ";
      } else {
        response = "Hello! ";
      }
      
      response += "I'm WebCraft AI, your web development assistant. ";
    }
    else if (simplifiedPrompt.includes("who are you") || simplifiedPrompt.includes("what are you")) {
      response = "I'm WebCraft AI, a development assistant specialized in helping you build web applications. ";
    }
    else if (simplifiedPrompt.includes("what can you do") || 
             simplifiedPrompt.includes("how") || simplifiedPrompt.includes("help")) {
      response = "I can help you create web applications by writing code, explaining concepts, and suggesting solutions to development problems. ";
    }
    else {
      // Generic conversation response
      response = "I'm here to help with your web development needs. ";
    }
    
    // Add more context based on conversation history
    if (isFirstMessage) {
      response += "I can help you build websites and web applications by generating HTML, CSS, and JavaScript code based on your descriptions. You can describe what you want to build, ask for specific features, or ask questions about web development concepts. What would you like to create today?";
    } else {
      // Reference previous conversation
      response += "How else can I assist you with your web development project? Feel free to ask about specific features, request code examples, or ask about web development concepts.";
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
  
  private parseResponse(response: PerplexityResponse): AIServiceResponse {
    try {
      const content = response.choices[0]?.message?.content || "";
      
      // Extract thinking process
      let thinkingProcess = "";
      const thinkingMatch = content.match(/(?:Thinking Process:|Thinking:|Analysis:|I'll analyze this step by step:)([\s\S]*?)(?=\{|\`\`\`|HTML:|CSS:|JS:|<html>|$)/i);
      if (thinkingMatch) {
        thinkingProcess = thinkingMatch[1].trim();
      }
      
      // First try to extract JSON
      try {
        // Find all JSON-like content in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            data: {
              code: {
                html: parsed.html || "",
                css: parsed.css || "",
                js: parsed.js || ""
              },
              explanation: thinkingProcess 
                ? `${thinkingProcess}\n\n${parsed.explanation || ""}` 
                : (parsed.explanation || "")
            }
          };
        }
      } catch (e) {
        console.log("JSON parsing failed, trying code blocks extraction");
      }
      
      // Fall back to code block extraction
      const htmlMatch = content.match(/```html([\s\S]*?)```/);
      const cssMatch = content.match(/```css([\s\S]*?)```/);
      const jsMatch = content.match(/```(?:js|javascript)([\s\S]*?)```/);
      
      // Extract explanation by removing code blocks
      let explanation = content.replace(/```html[\s\S]*?```/g, "")
                     .replace(/```css[\s\S]*?```/g, "")
                     .replace(/```js[\s\S]*?```/g, "")
                     .replace(/```javascript[\s\S]*?```/g, "")
                     .replace(/Thinking Process:[\s\S]*?(?=HTML:|CSS:|JS:|<html>|$)/i, "")
                     .replace(/Thinking:[\s\S]*?(?=HTML:|CSS:|JS:|<html>|$)/i, "")
                     .replace(/Analysis:[\s\S]*?(?=HTML:|CSS:|JS:|<html>|$)/i, "")
                     .trim();
      
      if (htmlMatch || cssMatch || jsMatch) {
        return {
          success: true,
          data: {
            code: {
              html: htmlMatch ? htmlMatch[1].trim() : "<div>Generated content</div>",
              css: cssMatch ? cssMatch[1].trim() : "/* Generated styles */",
              js: jsMatch ? jsMatch[1].trim() : "// Generated script"
            },
            explanation: thinkingProcess ? `${thinkingProcess}\n\n${explanation}` : explanation
          }
        };
      }
      
      // If no structured content found, use the entire content as explanation
      return {
        success: true,
        data: {
          code: {
            html: "",
            css: "",
            js: ""
          },
          explanation: content
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: "Error parsing API response" 
      };
    }
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
