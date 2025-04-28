
import { useState } from "react";
import { AIResponse } from "@/types";
import { nanoid } from "nanoid";

interface HFResponse {
  generated_text: string;
}

const API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateCode = async (prompt: string): Promise<AIResponse> => {
    setIsProcessing(true);
    
    try {
      // Create a more specific prompt for the AI model
      const enhancedPrompt = `
You are a web development AI that generates working HTML, CSS, and JavaScript code for web applications.
Based on the following request, generate code that can be used in a standalone web page.

User Request: ${prompt}

Please provide your response in the following JSON format ONLY:
{
  "html": "full HTML code here",
  "css": "full CSS code here",
  "js": "full JavaScript code here",
  "explanation": "brief explanation of what the code does"
}

Generate clean, modern, responsive code using best practices. Include comments where appropriate.
`;

      // Using the free Hugging Face Inference API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: enhancedPrompt }),
      });

      if (!response.ok) {
        console.error("API response error:", response.statusText);
        return { 
          code: {},
          error: "Failed to connect to the AI service."
        };
      }

      const data = await response.json();
      let jsonResponse: any = {};
      
      // Try to find and parse JSON from the response
      try {
        const jsonMatch = data.generated_text?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonResponse = JSON.parse(jsonMatch[0]);
        } else {
          // Simple fallback: try to extract code blocks
          const htmlMatch = data.generated_text?.match(/```html([\s\S]*?)```/);
          const cssMatch = data.generated_text?.match(/```css([\s\S]*?)```/);
          const jsMatch = data.generated_text?.match(/```js([\s\S]*?)```/);
          
          jsonResponse = {
            html: htmlMatch ? htmlMatch[1].trim() : "<div>Generated content</div>",
            css: cssMatch ? cssMatch[1].trim() : "/* Generated styles */",
            js: jsMatch ? jsMatch[1].trim() : "// Generated script"
          };
        }
      } catch (error) {
        console.error("Error parsing AI response:", error);
        return {
          code: {
            html: "<div>Something went wrong with the AI response. Please try again.</div>",
            css: "/* No styles generated */",
            js: "// No script generated"
          },
          error: "Failed to parse the AI response."
        };
      }

      return {
        code: {
          html: jsonResponse.html || "",
          css: jsonResponse.css || "",
          js: jsonResponse.js || ""
        },
        explanation: jsonResponse.explanation || ""
      };
    } catch (error) {
      console.error("Error in generateCode:", error);
      return {
        code: {},
        error: "An unexpected error occurred."
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Simple fallback if the AI service is unavailable
  const generateFallbackCode = (prompt: string): AIResponse => {
    // Generate a very basic template based on key terms in the prompt
    const isLandingPage = prompt.toLowerCase().includes("landing") || prompt.toLowerCase().includes("home");
    const isPortfolio = prompt.toLowerCase().includes("portfolio") || prompt.toLowerCase().includes("showcase");
    const isBlog = prompt.toLowerCase().includes("blog") || prompt.toLowerCase().includes("article");
    
    let html = '<div class="container"><h1>Generated Web App</h1><p>This is a basic template.</p></div>';
    let css = `
      .container { 
        max-width: 1200px; 
        margin: 0 auto; 
        padding: 20px;
        font-family: system-ui, sans-serif;
      }
      h1 { color: #333; }
    `;
    let js = "// Basic interactivity can be added here";
    
    if (isLandingPage) {
      html = `
        <header class="header">
          <nav>
            <div class="logo">Brand</div>
            <div class="nav-links">
              <a href="#">Home</a>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Contact</a>
            </div>
          </nav>
        </header>
        <main>
          <section class="hero">
            <h1>Welcome to Our Platform</h1>
            <p>The easiest way to build your next project</p>
            <button class="cta">Get Started</button>
          </section>
        </main>
      `;
      css += `
        .header {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
        }
        nav {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .nav-links {
          display: flex;
          gap: 1rem;
        }
        .hero {
          text-align: center;
          padding: 5rem 1rem;
        }
        .cta {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
        }
      `;
    }
    
    return {
      code: { html, css, js },
      explanation: "Basic template generated as a fallback."
    };
  };

  return {
    generateCode,
    isProcessing
  };
}
