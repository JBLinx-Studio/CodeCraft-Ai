
import { BaseClient, AIServiceResponse, AIRequestParams, AIClientOptions } from "./base-client";

export interface FreeClientOptions extends AIClientOptions {
  model?: string;
}

export class FreeAPIClient extends BaseClient {
  constructor(options: FreeClientOptions) {
    super(options);
  }

  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt } = params;
      
      console.log("🆓 Using Free API mode - template-based generation");
      
      // Create a simple response for free mode
      const enhancedPrompt = this.createEnhancedPrompt(prompt);
      
      // Simple template-based response
      const code = this.generateBasicTemplate(prompt);
      
      return {
        success: true,
        data: {
          code,
          explanation: "Generated using free template mode. For advanced AI features, please configure an API key."
        }
      };
    } catch (error) {
      console.error("Free API error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown free API error"
      };
    }
  }

  createEnhancedPrompt(prompt: string): string {
    return `Create a web application for: ${prompt}`;
  }

  private generateBasicTemplate(prompt: string): { html: string; css: string; js: string } {
    const title = this.extractTitle(prompt);
    
    return {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>${title}</h1>
            <p>Welcome to your new web application</p>
        </header>
        <main>
            <section class="content">
                <h2>Getting Started</h2>
                <p>This is a basic template generated for: ${prompt}</p>
                <button id="actionBtn" class="btn">Get Started</button>
            </section>
        </main>
        <footer>
            <p>&copy; 2024 ${title}. Built with Free Template Mode.</p>
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    min-height: 100vh;
    backdrop-filter: blur(10px);
}

header {
    text-align: center;
    padding: 2rem 0;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 2rem;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

header p {
    font-size: 1.2rem;
    color: #666;
}

.content {
    text-align: center;
    padding: 2rem;
}

.content h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
}

.content p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #666;
}

.btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

footer {
    text-align: center;
    padding: 2rem 0;
    border-top: 2px solid #f0f0f0;
    margin-top: 2rem;
    color: #666;
}

@media (max-width: 768px) {
    header h1 {
        font-size: 2rem;
    }
    
    .content h2 {
        font-size: 1.5rem;
    }
    
    .container {
        padding: 10px;
    }
}`,
      js: `document.addEventListener('DOMContentLoaded', function() {
    console.log('${title} application loaded');
    
    const actionBtn = document.getElementById('actionBtn');
    
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            alert('Hello! This is a basic template. Configure an API key for advanced AI features.');
            
            // Add some basic interactivity
            this.style.background = 'linear-gradient(135deg, #764ba2, #667eea)';
            setTimeout(() => {
                this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }, 200);
        });
    }
    
    // Add some basic animations
    const elements = document.querySelectorAll('.content, header');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});`
    };
  }

  private extractTitle(prompt: string): string {
    // Simple title extraction from prompt
    const words = prompt.split(' ').slice(0, 3);
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
