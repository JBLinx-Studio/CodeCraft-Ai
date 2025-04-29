
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

interface PerplexityRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export const PERPLEXITY_MODELS = {
  SMALL: "llama-3.1-sonar-small-128k-online",
  LARGE: "llama-3.1-sonar-large-128k-online",
  HUGE: "llama-3.1-sonar-huge-128k-online"
};

export async function callPerplexityAPI(
  apiKey: string,
  prompt: string,
  chatHistory: Array<{ role: string; content: string }>,
  modelType: keyof typeof PERPLEXITY_MODELS = "SMALL"
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const model = PERPLEXITY_MODELS[modelType];
    
    const request: PerplexityRequest = {
      model,
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
        "Authorization": `Bearer ${apiKey}`
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
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}

export function parsePerplexityResponse(response: PerplexityResponse): { 
  success: boolean; 
  data?: { 
    code: { 
      html?: string; 
      css?: string; 
      js?: string; 
    }; 
    explanation?: string; 
  }; 
  error?: string; 
} {
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
