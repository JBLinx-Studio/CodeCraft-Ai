
import { AIClient, AIClientOptions, AIRequestParams, AIServiceResponse } from "./base-client";

export interface HuggingFaceClientOptions extends AIClientOptions {
  model?: string;
}

export class HuggingFaceClient implements AIClient {
  private model: string;
  private apiKey: string | null;
  
  constructor(options: HuggingFaceClientOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model || "HuggingFaceH4/zephyr-7b-beta";
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory = [] } = params;
      
      // Create an enhanced prompt
      const enhancedPrompt = this.createEnhancedPrompt(prompt, chatHistory);
      
      const response = await fetch("https://api-inference.huggingface.co/models/" + this.model, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ inputs: enhancedPrompt }),
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
      // First show the AI's thinking process
      let thinkingProcess = "";
      const thinkingMatch = data.generated_text?.match(/Thinking:([\s\S]*?)(?=HTML:|CSS:|JS:|<html>|```html|$)/i);
      if (thinkingMatch) {
        thinkingProcess = thinkingMatch[1].trim();
      }
      
      // Try to find and parse JSON from the response
      const jsonMatch = data.generated_text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            data: {
              code: {
                html: parsed.html || "",
                css: parsed.css || "",
                js: parsed.js || ""
              },
              explanation: thinkingProcess ? `${thinkingProcess}\n\n${parsed.explanation || "Generated with AI"}` : (parsed.explanation || "Generated with AI")
            }
          };
        } catch (e) {
          // JSON parsing failed, continue to code block extraction
        }
      }
      
      // Extract code blocks
      const htmlMatch = data.generated_text?.match(/```html([\s\S]*?)```/);
      const cssMatch = data.generated_text?.match(/```css([\s\S]*?)```/);
      const jsMatch = data.generated_text?.match(/```js|```javascript([\s\S]*?)```/);
      
      // Extract explanation
      let explanation = data.generated_text || "Generated based on AI interpretation";
      
      // Clean up the explanation by removing code blocks
      explanation = explanation.replace(/```html[\s\S]*?```/g, "")
                     .replace(/```css[\s\S]*?```/g, "")
                     .replace(/```js[\s\S]*?```/g, "")
                     .replace(/```javascript[\s\S]*?```/g, "");
      
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
      
      return {
        success: true,
        data: {
          code: {
            html: "<div>Generated content</div>",
            css: "/* Generated styles */",
            js: "// Generated script"
          },
          explanation: thinkingProcess ? `${thinkingProcess}\n\n${explanation}` : explanation
        }
      };
    } catch (error) {
      return { success: false, error: "Error parsing API response" };
    }
  }
  
  createEnhancedPrompt(userPrompt: string, history: Array<{role: string, content: string}> = []): string {
    return `
${this.createEnhancedSystemPrompt()}

I want you to approach this web development request step by step:

1. First, share your thinking process under a "Thinking:" section. Analyze the request, consider different approaches, and explain your reasoning.

2. Then implement your solution with well-commented code blocks:

\`\`\`html
<!-- Your HTML code with comments explaining structure -->
\`\`\`

\`\`\`css
/* Your CSS code with comments explaining styling decisions */
\`\`\`

\`\`\`js
// Your JavaScript code with comments explaining logic
\`\`\`

3. Finally, provide a detailed explanation of your implementation, highlighting key decisions and how different parts work together.

USER REQUEST:
${userPrompt}

${history.length > 0 ? `CONVERSATION HISTORY:\n${this.formatChatHistory(history)}` : ""}
`;
  }

  private createEnhancedSystemPrompt(): string {
    return `You are a helpful AI assistant that specializes in web development. 
    Your task is to generate high-quality, functional HTML, CSS, and JavaScript code based on user requests.
    Provide well-commented, clean code that follows best practices.`;
  }

  private formatChatHistory(history: Array<{ role: string; content: string }>): string {
    return history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  }
}
