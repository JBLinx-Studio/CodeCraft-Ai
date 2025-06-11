
import { BaseClient, AIServiceResponse, AIRequestParams, AIClientOptions } from "./base-client";
import { puterService } from "@/services/puter-service";

export interface PuterClientOptions extends AIClientOptions {
  model?: string;
}

export class PuterClient extends BaseClient {
  constructor(options: PuterClientOptions) {
    super(options);
  }

  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory } = params;
      
      console.log("🤖 Using Puter.js AI (GPT-4o mini) for professional code generation...");
      
      // Create enhanced prompt for professional web development
      const enhancedPrompt = this.createLovableStylePrompt(prompt, chatHistory);
      
      const response = await puterService.generateCode(enhancedPrompt, chatHistory);
      
      if (response.success && response.code) {
        return {
          success: true,
          data: {
            code: response.code,
            explanation: response.explanation || "Generated professional web application with Puter.js AI"
          }
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to generate code with Puter.js"
        };
      }
    } catch (error) {
      console.error("Puter AI error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Puter AI error"
      };
    }
  }

  createLovableStylePrompt(prompt: string, chatHistory?: Array<{ role: string; content: string }>): string {
    let enhancedPrompt = `You are an expert fullstack AI software engineer, similar to the Lovable AI platform. Create a complete, production-ready web application for: "${prompt}"

🎯 CRITICAL REQUIREMENTS (MUST FOLLOW):
1. Generate COMPLETE, FUNCTIONAL, MODERN web applications
2. Use semantic HTML5 structure with proper accessibility
3. Create responsive CSS with modern techniques (flexbox, grid, variables)
4. Write clean, functional JavaScript/TypeScript with proper error handling
5. Include interactive features and professional UI/UX
6. Use modern web development best practices
7. Make it visually appealing with gradients, shadows, animations
8. Ensure cross-browser compatibility and mobile responsiveness
9. Include proper form validation and user feedback
10. Add loading states, hover effects, and smooth transitions

🏗️ ARCHITECTURE STANDARDS:
- Component-based structure
- Separation of concerns (HTML structure, CSS styling, JS functionality)
- Modern CSS features (custom properties, flexbox, grid, animations)
- Progressive enhancement approach
- Clean, maintainable code with comments

🎨 DESIGN PRINCIPLES:
- Professional, modern design language
- Consistent color scheme and typography
- Intuitive user interface with clear navigation
- Responsive design that works on all devices
- Accessibility considerations (ARIA labels, keyboard navigation)
- Smooth animations and micro-interactions

📦 DELIVERABLES FORMAT:
Return EXACTLY in this format:

=== HTML ===
[Complete, semantic HTML5 structure]

=== CSS ===
[Modern, responsive CSS with animations and professional styling]

=== JS ===
[Clean, functional JavaScript with proper error handling]

=== EXPLANATION ===
[Brief explanation of features and architecture decisions]

Build a professional, fully functional web application now:`;

    if (chatHistory && chatHistory.length > 0) {
      const context = chatHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n');
      enhancedPrompt += `\n\n📝 CONTEXT FROM CONVERSATION:\n${context}\n\nContinue building on this context while creating the new application.`;
    }

    return enhancedPrompt;
  }

  createEnhancedPrompt(prompt: string, chatHistory?: Array<{ role: string; content: string }>): string {
    return this.createLovableStylePrompt(prompt, chatHistory);
  }
}
