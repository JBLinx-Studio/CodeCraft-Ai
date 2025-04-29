
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
      
      const request = {
        model: this.model,
        messages: [
          {
            role: "system",
            content: `You are WebCraft AI, a specialized web development assistant that generates high-quality code for web applications. 
You ALWAYS provide your responses in JSON format with the following structure:
{
  "html": "Complete HTML code here",
  "css": "Complete CSS code here",
  "js": "Complete JavaScript code here",
  "explanation": "Detailed explanation of the code and how it works"
}
Focus on creating responsive, accessible, and modern web applications using best practices.`
          },
          ...chatHistory.slice(-5),
          {
            role: "user",
            content: prompt
          }
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
  
  private parseResponse(response: PerplexityResponse): AIServiceResponse {
    try {
      const content = response.choices[0]?.message?.content || "";
      
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
              explanation: parsed.explanation || "Generated with Perplexity AI"
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
      
      if (htmlMatch || cssMatch || jsMatch) {
        return {
          success: true,
          data: {
            code: {
              html: htmlMatch ? htmlMatch[1].trim() : "<div>Generated content</div>",
              css: cssMatch ? cssMatch[1].trim() : "/* Generated styles */",
              js: jsMatch ? jsMatch[1].trim() : "// Generated script"
            },
            explanation: "Generated based on AI interpretation"
          }
        };
      }
      
      // If no structured content found, try to extract explanation at least
      return {
        success: true,
        data: {
          code: {
            html: "<div>Default content</div>",
            css: "/* Default styles */",
            js: "// Default script"
          },
          explanation: content || "Generated with Perplexity AI"
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
