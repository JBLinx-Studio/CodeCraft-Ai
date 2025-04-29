
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
      
      const systemPrompt = `You are WebCraft AI, a specialized web development assistant that generates high-quality code for web applications.
You provide thoughtful, step-by-step explanations and create responsive, accessible, modern web applications.
When responding:
1. First understand the user's request thoroughly
2. Provide a brief explanation of your approach
3. Generate clean, well-commented code that follows best practices
4. Include helpful explanations about how the code works
5. Consider edge cases and performance optimizations

Always structure your response as valid JSON with the following format:
{
  "html": "Complete HTML code here with appropriate comments",
  "css": "Complete CSS code here with modern responsive design patterns",
  "js": "Complete JavaScript code here with proper error handling",
  "explanation": "Detailed step-by-step explanation of how the code works and why you made certain decisions"
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
      } else {
        return { success: false, error: "Failed to parse AI response" };
      }
    } catch (error) {
      return { success: false, error: "Error parsing API response" };
    }
  }
}
