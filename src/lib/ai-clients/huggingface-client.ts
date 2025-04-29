
import { AIClient, AIClientOptions, AIRequestParams } from "./base-client";
import { AIServiceResponse } from "@/types";

export interface HuggingFaceClientOptions extends AIClientOptions {
  model?: string;
}

export class HuggingFaceClient extends AIClient {
  private model: string;
  
  constructor(options: HuggingFaceClientOptions) {
    super(options);
    this.model = options.model || "HuggingFaceH4/zephyr-7b-beta";
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory } = params;
      
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
      // Try to find and parse JSON from the response
      const jsonMatch = data.generated_text?.match(/\{[\s\S]*\}/);
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
            explanation: parsed.explanation || "Generated with AI"
          }
        };
      }
      
      // Simple fallback: try to extract code blocks
      const htmlMatch = data.generated_text?.match(/```html([\s\S]*?)```/);
      const cssMatch = data.generated_text?.match(/```css([\s\S]*?)```/);
      const jsMatch = data.generated_text?.match(/```js([\s\S]*?)```/);
      
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
      
      return { success: false, error: "Failed to extract code from response" };
    } catch (error) {
      return { success: false, error: "Error parsing API response" };
    }
  }
  
  private createEnhancedPrompt(userPrompt: string, history: Array<{role: string, content: string}>) {
    return `
You are a web development AI that creates HTML, CSS, and JavaScript code.
Based on this request, generate code for a web page:

${userPrompt}

${history.length > 0 ? `Previous conversation context: ${history.slice(-2).map(msg => `${msg.role}: ${msg.content}`).join("\n")}` : ""}

Format your answer as:
\`\`\`html
<html>...</html>
\`\`\`

\`\`\`css
/* styles */
\`\`\`

\`\`\`js
// scripts
\`\`\`

Explanation: briefly explain what this code does

Generate responsive code with CSS best practices.
`;
  }
}
