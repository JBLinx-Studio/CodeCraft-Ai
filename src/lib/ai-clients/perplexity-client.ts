
import { AIClient, AIClientOptions, AIRequestParams } from "./base-client";
import { AIServiceResponse } from "@/types";

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

export class PerplexityClient extends AIClient {
  private model: string;
  
  constructor(options: PerplexityClientOptions) {
    super(options);
    this.model = options.model 
      ? (typeof options.model === 'string' && options.model in PERPLEXITY_MODELS 
          ? PERPLEXITY_MODELS[options.model as keyof typeof PERPLEXITY_MODELS]
          : options.model)
      : PERPLEXITY_MODELS.SMALL;
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory } = params;
      
      // Handle simple greetings directly
      if (this.isSimpleGreeting(prompt)) {
        return this.handleSimpleGreeting(prompt, chatHistory);
      }
      
      const systemMessage = `${this.createEnhancedSystemPrompt()}

When responding to the user, follow this specific structure:

1. Start with a "Thinking:" section where you think step by step about the request, analyze requirements, and plan your approach.

2. Then provide your code solution in JSON format:
{
  "html": "Complete HTML code with semantic structure and helpful comments",
  "css": "Complete CSS code with responsive design and clear organization",
  "js": "Complete JavaScript code with proper error handling and readability",
  "explanation": "Detailed explanation of your implementation approach, key decisions, and how components work together"
}

Make your response educational, thoughtful, and practical. Show your reasoning process clearly.`;

      const request = {
        model: this.model,
        messages: [
          { role: "system", content: systemMessage },
          ...chatHistory.slice(-5),
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
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
  
  private isSimpleGreeting(prompt: string): boolean {
    const simplifiedPrompt = prompt.toLowerCase().trim();
    const greetings = [
      "hello", "hi", "hey", "greetings", "howdy", 
      "what's up", "whats up", "sup", "yo", 
      "good morning", "good afternoon", "good evening"
    ];
    
    return greetings.some(greeting => 
      simplifiedPrompt === greeting || 
      simplifiedPrompt.startsWith(`${greeting} `) || 
      simplifiedPrompt.startsWith(`${greeting},`)
    );
  }
  
  private handleSimpleGreeting(prompt: string, history: Array<{role: string, content: string}>): AIServiceResponse {
    const isFirstMessage = history.filter(msg => msg.role === "user").length === 0;
    
    let greeting = "Hello! I'm WebCraft AI, your full-stack web development assistant. ";
    
    if (prompt.toLowerCase().includes("morning")) {
      greeting = "Good morning! I'm WebCraft AI, ready to help with your web development projects. ";
    } else if (prompt.toLowerCase().includes("afternoon")) {
      greeting = "Good afternoon! I'm WebCraft AI, excited to assist with your web development needs. ";
    } else if (prompt.toLowerCase().includes("evening")) {
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
  
  private parseResponse(response: PerplexityResponse): AIServiceResponse {
    try {
      const content = response.choices[0]?.message?.content || "";
      
      // Extract thinking process
      let thinkingProcess = "";
      const thinkingMatch = content.match(/Thinking:([\s\S]*?)(?=\{|\`\`\`|HTML:|CSS:|JS:|<html>|$)/i);
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
                ? `${thinkingProcess}\n\n${parsed.explanation || "Generated with Perplexity AI"}` 
                : (parsed.explanation || "Generated with Perplexity AI")
            }
          };
        }
      } catch (e) {
        console.log("JSON parsing failed, trying code blocks extraction");
      }
      
      // Fall back to code block extraction
      const htmlMatch = content.match(/```html([\s\S]*?)```/);
      const cssMatch = content.match(/```css([\s\S]*?)```/);
      const jsMatch = content.match(/```js|```javascript([\s\S]*?)```/);
      
      // Extract explanation by removing code blocks
      let explanation = content.replace(/```html[\s\S]*?```/g, "")
                     .replace(/```css[\s\S]*?```/g, "")
                     .replace(/```js[\s\S]*?```/g, "")
                     .replace(/```javascript[\s\S]*?```/g, "")
                     .replace(/Thinking:[\s\S]*?(?=HTML:|CSS:|JS:|<html>|$)/i, "")
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
      
      // If no structured content found, use the entire content
      return {
        success: true,
        data: {
          code: {
            html: "<div>Default content</div>",
            css: "/* Default styles */",
            js: "// Default script"
          },
          explanation: thinkingProcess ? `${thinkingProcess}\n\n${explanation}` : content
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: "Error parsing API response" 
      };
    }
  }
}
