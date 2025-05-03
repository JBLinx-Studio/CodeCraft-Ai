
import { BaseClient, AIClientResponse, AIRequestParams } from "./base-client";
import { AIClientConfig } from "./ai-client-factory";

export const PERPLEXITY_MODELS = {
  SMALL: "llama-3-8b-instruct",
  MEDIUM: "mixtral-8x7b-instruct",
  LARGE: "sonar-medium-online"
};

export class PerplexityClient extends BaseClient {
  protected model: string;

  constructor(config: AIClientConfig) {
    super({ apiKey: config.apiKey });
    this.model = config.modelType && PERPLEXITY_MODELS[config.modelType as keyof typeof PERPLEXITY_MODELS] 
      ? PERPLEXITY_MODELS[config.modelType as keyof typeof PERPLEXITY_MODELS]
      : PERPLEXITY_MODELS.SMALL;
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIClientResponse> {
    try {
      const { prompt, chatHistory = [] } = params;
      
      const formattedChatHistory = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: "You are a web development AI assistant that helps create HTML, CSS, and JavaScript code for web applications. When asked to build something, you should provide the complete HTML, CSS, and JavaScript code necessary to implement the requested feature or application. Separate your response into sections for HTML, CSS, and JavaScript. Make your designs responsive and visually appealing."
            },
            ...formattedChatHistory,
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `API Error (${response.status}): ${errorText || response.statusText}`
        };
      }
      
      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;
      
      // Parse the response to extract code blocks
      const htmlMatch = assistantResponse.match(/```html\s*([\s\S]*?)\s*```/i);
      const cssMatch = assistantResponse.match(/```css\s*([\s\S]*?)\s*```/i);
      const jsMatch = assistantResponse.match(/```js(?:cript)?\s*([\s\S]*?)\s*```/i);
      
      // Clean up explanation by removing code blocks
      let explanation = assistantResponse.replace(/```(?:html|css|js|javascript)[\s\S]*?```/gi, '').trim();
      
      return {
        success: true,
        data: {
          code: {
            html: htmlMatch ? htmlMatch[1].trim() : "",
            css: cssMatch ? cssMatch[1].trim() : "",
            js: jsMatch ? jsMatch[1].trim() : ""
          },
          explanation
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
}
