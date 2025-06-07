
// Puter.js service for AI, cloud storage, auth, and database operations
declare global {
  interface Window {
    puter: any;
  }
}

export class PuterService {
  private static instance: PuterService;
  private puter: any;

  private constructor() {
    this.puter = window.puter;
    this.initializePuter();
  }

  static getInstance(): PuterService {
    if (!PuterService.instance) {
      PuterService.instance = new PuterService();
    }
    return PuterService.instance;
  }

  private async initializePuter() {
    // Wait for Puter to be available
    if (typeof window !== 'undefined' && window.puter) {
      this.puter = window.puter;
      console.log('Puter.js initialized successfully');
    } else {
      // Retry after a short delay
      setTimeout(() => this.initializePuter(), 100);
    }
  }

  // AI Chat using Puter's GPT-4o mini
  async generateAIResponse(prompt: string, chatHistory?: Array<{role: string, content: string}>): Promise<{
    success: boolean;
    text?: string;
    error?: string;
  }> {
    try {
      if (!this.puter) {
        throw new Error('Puter.js not initialized');
      }

      // Include chat history in the prompt for context
      let fullPrompt = prompt;
      if (chatHistory && chatHistory.length > 0) {
        const contextPrompt = chatHistory
          .slice(-5) // Only use last 5 messages for context
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        fullPrompt = `Context:\n${contextPrompt}\n\nUser: ${prompt}`;
      }

      const response = await this.puter.ai.chat(fullPrompt);
      
      return {
        success: true,
        text: response
      };
    } catch (error) {
      console.error('Puter AI error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown AI error'
      };
    }
  }

  // Enhanced code generation with better prompting
  async generateCode(userPrompt: string, chatHistory?: Array<{role: string, content: string}>): Promise<{
    success: boolean;
    code?: {
      html: string;
      css: string;
      js: string;
    };
    explanation?: string;
    error?: string;
  }> {
    try {
      const enhancedPrompt = `You are a professional fullstack web developer. Generate complete, production-ready web application code based on this request: "${userPrompt}"

IMPORTANT REQUIREMENTS:
1. Always return VALID, COMPLETE HTML, CSS, and JavaScript code
2. Make the code responsive and modern
3. Include proper semantic HTML structure
4. Use modern CSS features (flexbox, grid, animations)
5. Write clean, functional JavaScript
6. Ensure the app is fully interactive and functional
7. Include error handling where appropriate
8. Use modern web development best practices

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
=== HTML ===
[Complete HTML code here]

=== CSS ===
[Complete CSS code here]

=== JS ===
[Complete JavaScript code here]

=== EXPLANATION ===
[Brief explanation of what you built and key features]

Generate a professional, fully functional web application now:`;

      const response = await this.generateAIResponse(enhancedPrompt, chatHistory);

      if (!response.success || !response.text) {
        throw new Error(response.error || 'Failed to generate code');
      }

      // Parse the AI response to extract HTML, CSS, JS, and explanation
      const parsed = this.parseCodeResponse(response.text);
      
      return {
        success: true,
        code: parsed.code,
        explanation: parsed.explanation
      };
    } catch (error) {
      console.error('Code generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Code generation failed'
      };
    }
  }

  private parseCodeResponse(response: string): {
    code: { html: string; css: string; js: string };
    explanation: string;
  } {
    const sections = {
      html: '',
      css: '',
      js: '',
      explanation: ''
    };

    try {
      // Extract HTML
      const htmlMatch = response.match(/=== HTML ===([\s\S]*?)(?:=== CSS ===|$)/);
      if (htmlMatch) {
        sections.html = htmlMatch[1].trim();
      }

      // Extract CSS
      const cssMatch = response.match(/=== CSS ===([\s\S]*?)(?:=== JS ===|$)/);
      if (cssMatch) {
        sections.css = cssMatch[1].trim();
      }

      // Extract JS
      const jsMatch = response.match(/=== JS ===([\s\S]*?)(?:=== EXPLANATION ===|$)/);
      if (jsMatch) {
        sections.js = jsMatch[1].trim();
      }

      // Extract explanation
      const explanationMatch = response.match(/=== EXPLANATION ===([\s\S]*?)$/);
      if (explanationMatch) {
        sections.explanation = explanationMatch[1].trim();
      }

      // Fallback: if no sections found, try to extract code blocks
      if (!sections.html && !sections.css && !sections.js) {
        return this.fallbackCodeExtraction(response);
      }

    } catch (error) {
      console.warn('Error parsing code response, using fallback:', error);
      return this.fallbackCodeExtraction(response);
    }

    return {
      code: {
        html: sections.html || this.generateFallbackHTML(),
        css: sections.css || this.generateFallbackCSS(),
        js: sections.js || this.generateFallbackJS()
      },
      explanation: sections.explanation || 'Generated web application based on your request.'
    };
  }

  private fallbackCodeExtraction(response: string) {
    // Try to extract any HTML, CSS, JS from code blocks
    const htmlMatch = response.match(/```html([\s\S]*?)```/i) || response.match(/<html[\s\S]*?<\/html>/i);
    const cssMatch = response.match(/```css([\s\S]*?)```/i);
    const jsMatch = response.match(/```javascript([\s\S]*?)```/i) || response.match(/```js([\s\S]*?)```/i);

    return {
      code: {
        html: htmlMatch ? htmlMatch[1] || htmlMatch[0] : this.generateFallbackHTML(),
        css: cssMatch ? cssMatch[1] : this.generateFallbackCSS(),
        js: jsMatch ? jsMatch[1] : this.generateFallbackJS()
      },
      explanation: 'Generated web application with AI assistance.'
    };
  }

  private generateFallbackHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to Your App</h1>
        </header>
        <main>
            <p>Your AI-generated application is ready!</p>
            <button id="actionBtn">Click Me</button>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateFallbackCSS(): string {
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    text-align: center;
    margin-bottom: 2rem;
}

h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

main {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    text-align: center;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
}

button:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
}`;
  }

  private generateFallbackJS(): string {
    return `document.addEventListener('DOMContentLoaded', function() {
    const actionBtn = document.getElementById('actionBtn');
    
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            alert('Hello from your AI-generated app!');
            this.textContent = 'Clicked!';
            this.style.background = '#28a745';
        });
    }
    
    console.log('AI-generated app initialized successfully!');
});`;
  }

  // Cloud storage operations
  async saveProject(projectName: string, code: {html: string, css: string, js: string}): Promise<boolean> {
    try {
      const projectData = {
        name: projectName,
        code,
        timestamp: new Date().toISOString()
      };

      await this.puter.fs.write(`projects/${projectName}.json`, JSON.stringify(projectData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  }

  async loadProject(projectName: string): Promise<{html: string, css: string, js: string} | null> {
    try {
      const fileContent = await this.puter.fs.read(`projects/${projectName}.json`);
      const projectData = JSON.parse(await fileContent.text());
      return projectData.code;
    } catch (error) {
      console.error('Error loading project:', error);
      return null;
    }
  }

  // Key-value store for user preferences
  async saveUserPreference(key: string, value: any): Promise<boolean> {
    try {
      await this.puter.kv.set(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving preference:', error);
      return false;
    }
  }

  async getUserPreference(key: string): Promise<any | null> {
    try {
      const value = await this.puter.kv.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting preference:', error);
      return null;
    }
  }

  // Authentication methods
  async isSignedIn(): Promise<boolean> {
    try {
      return this.puter.auth.isSignedIn();
    } catch (error) {
      return false;
    }
  }

  async signIn(): Promise<boolean> {
    try {
      await this.puter.auth.signIn();
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  }

  async getUserInfo(): Promise<any | null> {
    try {
      return await this.puter.auth.getUser();
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
}

export const puterService = PuterService.getInstance();
