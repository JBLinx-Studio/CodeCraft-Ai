
import { AIClient, AIClientOptions, AIRequestParams } from "./base-client";
import { AIServiceResponse } from "@/types";

export interface OpenAIClientOptions extends AIClientOptions {
  model?: string;
}

export class OpenAIClient extends AIClient {
  private model: string;
  
  constructor(options: OpenAIClientOptions) {
    super(options);
    this.model = options.model || "gpt-3.5-turbo";
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory } = params;
      
      const systemPrompt = `${this.createEnhancedSystemPrompt()}

Please provide your response in this specific JSON format:
{
  "thinking": "Share your step-by-step thought process here, analyzing the request and planning your approach...",
  "html": "Complete HTML code here with appropriate semantic structure and comments",
  "css": "Complete CSS code here with modern responsive design patterns and well-commented sections",
  "js": "Complete JavaScript code here with proper error handling and detailed comments explaining the logic",
  "explanation": "Detailed explanation of your implementation approach, key decisions, and how different parts work together"
}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory.slice(-5), // Include last 5 messages for context
            { role: "user", content: this.enhancePromptWithContext(prompt, []) }
          ],
          temperature: 0.7,
          max_tokens: 4000
        }),
      });

      if (!response.ok) {
        return { 
          success: false, 
          error: `API responded with status ${response.status}: ${response.statusText}` 
        };
      }

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  }
  
  private parseResponse(data: any): AIServiceResponse {
    try {
      const content = data.choices[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Build an enhanced explanation that includes thinking process
          const enhancedExplanation = parsed.thinking 
            ? `${parsed.thinking}\n\n${parsed.explanation || ""}` 
            : parsed.explanation || "Generated with AI";
          
          return {
            success: true,
            data: {
              code: {
                html: parsed.html || "",
                css: parsed.css || "",
                js: parsed.js || ""
              },
              explanation: enhancedExplanation
            }
          };
        } catch (e) {
          // If JSON parsing fails, attempt to extract code blocks
          const htmlMatch = content.match(/```html([\s\S]*?)```/);
          const cssMatch = content.match(/```css([\s\S]*?)```/);
          const jsMatch = content.match(/```js|javascript([\s\S]*?)```/);
          
          if (htmlMatch || cssMatch || jsMatch) {
            return {
              success: true,
              data: {
                code: {
                  html: htmlMatch ? htmlMatch[1].trim() : "",
                  css: cssMatch ? cssMatch[1].trim() : "",
                  js: jsMatch ? jsMatch[1].trim() : ""
                },
                explanation: "I've analyzed your request and created code to meet your needs. Here's what I built:\n\n" + content
              }
            };
          }
        }
      }
      
      // Fallback: return the entire content as explanation
      return { 
        success: true,
        data: {
          code: {
            html: "<div>Generated content</div>",
            css: "/* Generated styles */",
            js: "// Generated script"
          },
          explanation: content || "Generated with AI"
        }
      };
    } catch (error) {
      return { success: false, error: "Error parsing API response" };
    }
  }
}
