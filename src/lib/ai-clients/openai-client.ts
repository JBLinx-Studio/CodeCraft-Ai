
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
      
      // Create an enhanced prompt
      const enhancedPrompt = this.createEnhancedPrompt(prompt, chatHistory);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system", 
              content: "You are WebCraft AI, a specialized assistant that generates high-quality code for web applications. You always respond with valid JSON containing HTML, CSS, and JavaScript code."
            },
            ...chatHistory.slice(-5), // Include last 5 messages for context
            {
              role: "user", 
              content: enhancedPrompt
            }
          ],
          temperature: 0.7,
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
  
  private createEnhancedPrompt(userPrompt: string, history: Array<{role: string, content: string}>) {
    // Extract keywords from the prompt and previous conversation
    const allText = [
      userPrompt,
      ...history.map(msg => msg.content)
    ].join(" ");
    
    // Extract key features requested
    const features = this.extractRequestedFeatures(allText);
    const stylePreferences = this.extractStylePreferences(allText);
    
    // Build a more specific prompt for the AI model
    return `
You are a web development AI that generates working HTML, CSS, and JavaScript code for web applications.
Based on the following request, generate code that can be used in a standalone web page.

User Request: ${userPrompt}

${history.length > 0 ? `Previous conversation context: ${history.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join("\n")}` : ""}

Requested features: ${features.join(", ")}
Style preferences: ${stylePreferences.join(", ")}

Please provide your response in the following JSON format ONLY:
{
  "html": "full HTML code here",
  "css": "full CSS code here",
  "js": "full JavaScript code here",
  "explanation": "brief explanation of what the code does"
}

Generate clean, modern, responsive code using best practices. Include comments where appropriate.
`;
  }
  
  private extractRequestedFeatures(text: string) {
    const featureKeywords = {
      "form": ["form", "input", "submit", "field"],
      "navigation": ["navigation", "navbar", "menu", "header"],
      "gallery": ["gallery", "carousel", "slider", "images"],
      "authentication": ["login", "register", "auth", "account"],
      "dark mode": ["dark mode", "theme", "toggle", "light/dark"],
      "responsive": ["responsive", "mobile", "desktop", "media query"],
      "animation": ["animation", "transition", "fade", "slide"],
    };
    
    const foundFeatures: string[] = [];
    
    Object.entries(featureKeywords).forEach(([feature, keywords]) => {
      const textLower = text.toLowerCase();
      if (keywords.some(keyword => textLower.includes(keyword.toLowerCase()))) {
        foundFeatures.push(feature);
      }
    });
    
    return foundFeatures.length > 0 ? foundFeatures : ["basic website"];
  }
  
  private extractStylePreferences(text: string) {
    const styleKeywords = {
      "minimalist": ["minimalist", "clean", "simple", "minimal"],
      "colorful": ["colorful", "vibrant", "bright", "bold colors"],
      "professional": ["professional", "business", "corporate", "formal"],
      "playful": ["playful", "fun", "creative", "casual"],
      "modern": ["modern", "contemporary", "sleek", "cutting-edge"],
      "retro": ["retro", "vintage", "classic", "nostalgic"],
    };
    
    const foundStyles: string[] = [];
    
    Object.entries(styleKeywords).forEach(([style, keywords]) => {
      const textLower = text.toLowerCase();
      if (keywords.some(keyword => textLower.includes(keyword.toLowerCase()))) {
        foundStyles.push(style);
      }
    });
    
    return foundStyles.length > 0 ? foundStyles : ["modern", "clean"];
  }
}
