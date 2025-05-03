
import { AIClientConfig, AIResponse } from "@/types";
import { AIClientResponse, BaseClient, AIRequestParams } from "./base-client";

export class PerplexityClient extends BaseClient {
  private apiKey: string;
  private modelType: string;

  constructor(config: AIClientConfig) {
    super();
    this.apiKey = config.apiKey;
    this.modelType = config.modelType || "SMALL";
  }

  async generateResponse(params: AIRequestParams): Promise<AIClientResponse> {
    try {
      const { prompt, chatHistory } = params;
      
      // Prepare messages including system prompt and conversation history
      const messages = [
        {
          role: "system",
          content: "You are an expert web developer. Generate HTML, CSS, and JavaScript code for the requested web application. Respond with ONLY code blocks for HTML, CSS, and JavaScript, and a brief explanation."
        },
        ...chatHistory.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })),
        {
          role: "user",
          content: prompt
        }
      ];
      
      // Model selection based on configuration
      const model = this.modelType === "LARGE" 
        ? "llama-3.1-sonar-large-128k-online" 
        : "llama-3.1-sonar-small-128k-online";

      // Make API request to Perplexity
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 4000,
          temperature: 0.2,
          frequency_penalty: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Perplexity API error: ${response.status} ${
          errorData.error?.message || response.statusText
        }`);
      }

      const data = await response.json();
      const aiContent = data.choices[0]?.message?.content || "";
      
      // Extract code blocks from the response
      const codeBlocks = this.extractCodeBlocks(aiContent);
      
      // Prepare the response with code and explanation
      const aiResponse: AIResponse = {
        code: {
          html: codeBlocks.html || "",
          css: codeBlocks.css || "",
          js: codeBlocks.js || ""
        },
        explanation: this.extractExplanation(aiContent, codeBlocks.explanationExists)
      };
      
      return {
        success: true,
        data: aiResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "API error occurred"
      };
    }
  }
  
  private extractCodeBlocks(content: string): { 
    html: string; 
    css: string; 
    js: string; 
    explanationExists: boolean 
  } {
    const htmlRegex = /```html\n([\s\S]*?)```/;
    const cssRegex = /```css\n([\s\S]*?)```/;
    const jsRegex = /```(?:javascript|js)\n([\s\S]*?)```/;
    
    const htmlMatch = content.match(htmlRegex);
    const cssMatch = content.match(cssRegex);
    const jsMatch = content.match(jsRegex);
    
    return {
      html: htmlMatch ? htmlMatch[1].trim() : "",
      css: cssMatch ? cssMatch[1].trim() : "",
      js: jsMatch ? jsMatch[1].trim() : "",
      explanationExists: true // We always provide an explanation
    };
  }
  
  private extractExplanation(content: string, hasCodeBlocks: boolean): string {
    // If there are no code blocks, the entire content is the explanation
    if (!hasCodeBlocks) return content.trim();
    
    // Remove code blocks to get explanation
    let explanation = content
      .replace(/```html\n[\s\S]*?```/g, "")
      .replace(/```css\n[\s\S]*?```/g, "")
      .replace(/```(?:javascript|js)\n[\s\S]*?```/g, "")
      .trim();
    
    return explanation || "Code generated successfully";
  }
}
