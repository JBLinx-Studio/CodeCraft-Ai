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
      console.log('🚀 Puter.js initialized successfully - Free AI, Cloud, Auth ready!');
    } else {
      // Retry after a short delay
      setTimeout(() => this.initializePuter(), 100);
    }
  }

  // Enhanced AI Chat using Puter's GPT-4o mini with Lovable-style prompting
  async generateAIResponse(prompt: string, chatHistory?: Array<{role: string, content: string}>): Promise<{
    success: boolean;
    text?: string;
    error?: string;
  }> {
    try {
      if (!this.puter) {
        throw new Error('Puter.js not initialized - please refresh the page');
      }

      console.log('🤖 Generating response with Puter.js GPT-4o mini...');

      // Include chat history in the prompt for context
      let fullPrompt = prompt;
      if (chatHistory && chatHistory.length > 0) {
        const contextPrompt = chatHistory
          .slice(-5) // Only use last 5 messages for context
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        fullPrompt = `Previous Context:\n${contextPrompt}\n\nCurrent Request: ${prompt}`;
      }

      const response = await this.puter.ai.chat(fullPrompt);
      
      console.log('✅ AI response generated successfully');
      
      return {
        success: true,
        text: response
      };
    } catch (error) {
      console.error('❌ Puter AI error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown AI error'
      };
    }
  }

  // Enhanced code generation with Lovable-style professional output
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
      console.log('🛠️ Starting professional code generation...');
      
      const enhancedPrompt = this.createLovableStylePrompt(userPrompt, chatHistory);
      const response = await this.generateAIResponse(enhancedPrompt, chatHistory);

      if (!response.success || !response.text) {
        throw new Error(response.error || 'Failed to generate code with Puter.js AI');
      }

      console.log('🔧 Parsing AI response...');
      
      // Parse the AI response to extract HTML, CSS, JS, and explanation
      const parsed = this.parseCodeResponse(response.text);
      
      console.log('✅ Code generation completed successfully');
      
      return {
        success: true,
        code: parsed.code,
        explanation: parsed.explanation
      };
    } catch (error) {
      console.error('❌ Code generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Code generation failed'
      };
    }
  }

  private createLovableStylePrompt(userPrompt: string, chatHistory?: Array<{role: string, content: string}>): string {
    return `You are a professional fullstack AI engineer like Lovable AI. Create a complete, production-ready web application for: "${userPrompt}"

🎯 REQUIREMENTS:
- Generate COMPLETE, FUNCTIONAL, PROFESSIONAL web applications
- Modern HTML5 semantic structure with accessibility
- Responsive CSS with animations, gradients, and modern design
- Interactive JavaScript with proper error handling
- Professional UI/UX with smooth transitions
- Mobile-first responsive design
- Clean, maintainable code architecture

FORMAT RESPONSE EXACTLY AS:

=== HTML ===
[Complete semantic HTML5 structure]

=== CSS ===
[Modern responsive CSS with professional styling]

=== JS ===
[Clean functional JavaScript with interactivity]

=== EXPLANATION ===
[Brief technical overview of the application]

${chatHistory && chatHistory.length > 0 ? `\nContext: ${chatHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}` : ''}

Create the application now:`;
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
      console.warn('⚠️ Error parsing structured response, using fallback extraction:', error);
      return this.fallbackCodeExtraction(response);
    }

    return {
      code: {
        html: sections.html || this.generateProfessionalHTML(),
        css: sections.css || this.generateProfessionalCSS(),
        js: sections.js || this.generateProfessionalJS()
      },
      explanation: sections.explanation || 'Professional web application generated with Puter.js AI'
    };
  }

  private fallbackCodeExtraction(response: string) {
    // Try to extract any HTML, CSS, JS from code blocks
    const htmlMatch = response.match(/```html([\s\S]*?)```/i) || response.match(/<html[\s\S]*?<\/html>/i);
    const cssMatch = response.match(/```css([\s\S]*?)```/i);
    const jsMatch = response.match(/```javascript([\s\S]*?)```/i) || response.match(/```js([\s\S]*?)```/i);

    return {
      code: {
        html: htmlMatch ? (htmlMatch[1] || htmlMatch[0]) : this.generateProfessionalHTML(),
        css: cssMatch ? cssMatch[1] : this.generateProfessionalCSS(),
        js: jsMatch ? jsMatch[1] : this.generateProfessionalJS()
      },
      explanation: 'Professional web application generated with AI assistance.'
    };
  }

  private generateProfessionalHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Web App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <header class="hero-section">
            <div class="container">
                <h1 class="hero-title">Professional Web Application</h1>
                <p class="hero-subtitle">Built with advanced AI technology</p>
                <button class="cta-button" id="getStarted">Get Started</button>
            </div>
        </header>
        
        <main class="main-content">
            <div class="container">
                <section class="features-grid">
                    <div class="feature-card">
                        <h3>Feature One</h3>
                        <p>Professional feature description</p>
                    </div>
                    <div class="feature-card">
                        <h3>Feature Two</h3>
                        <p>Advanced functionality showcase</p>
                    </div>
                    <div class="feature-card">
                        <h3>Feature Three</h3>
                        <p>Modern web application capabilities</p>
                    </div>
                </section>
            </div>
        </main>
        
        <footer class="app-footer">
            <div class="container">
                <p>&copy; 2024 Professional Web App. Built with AI.</p>
            </div>
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateProfessionalCSS(): string {
    return `/* Professional Web Application Styles */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    --text-primary: #2d3748;
    --text-secondary: #4a5568;
    --bg-primary: #ffffff;
    --bg-secondary: #f7fafc;
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-lg: 0 20px 25px rgba(0,0,0,0.1);
    --radius: 12px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--bg-primary);
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 6rem 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" fill-opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" fill-opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
    opacity: 0;
    animation: fadeInUp 1s ease forwards;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    opacity: 0;
    animation: fadeInUp 1s ease 0.2s forwards;
}

.cta-button {
    background: white;
    color: var(--primary-color);
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-lg);
    opacity: 0;
    animation: fadeInUp 1s ease 0.4s forwards;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}

/* Main Content */
.main-content {
    flex: 1;
    padding: 6rem 0;
    background: var(--bg-secondary);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    border: 1px solid #e2e8f0;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

.feature-card h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

/* Footer */
.app-footer {
    background: var(--text-primary);
    color: white;
    padding: 2rem 0;
    text-align: center;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
    
    .hero-section {
        padding: 4rem 0;
    }
    
    .main-content {
        padding: 4rem 0;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}`;
  }

  private generateProfessionalJS(): string {
    return `// Professional Web Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Professional Web App Initialized');
    
    // Initialize application components
    initializeHeroSection();
    initializeFeatureCards();
    initializeScrollAnimations();
    
    // Add professional interactions
    addButtonInteractions();
    addScrollEffects();
});

function initializeHeroSection() {
    const ctaButton = document.getElementById('getStarted');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Professional interaction feedback
            showNotification('Welcome to the professional experience!', 'success');
            
            // Smooth scroll to main content
            document.querySelector('.main-content').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Add entrance animation delay
        card.style.animationDelay = \`\${index * 0.1}s\`;
        
        // Add hover interactions
        card.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
        
        // Add click interaction
        card.addEventListener('click', function() {
            showNotification(\`Feature \${index + 1} activated!\`, 'info');
        });
    });
}

function initializeScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

function addButtonInteractions() {
    // Add professional button interactions throughout the app
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
    });
}

function addScrollEffects() {
    // Add parallax and scroll effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const speed = scrolled * 0.5;
            heroSection.style.transform = \`translateY(\${speed}px)\`;
        }
    });
}

function showNotification(message, type = 'info') {
    // Create professional notification system
    const notification = document.createElement('div');
    notification.className = \`notification notification--\${type}\`;
    notification.textContent = message;
    
    // Notification styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '300px',
        fontSize: '0.9rem',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add professional error handling
window.addEventListener('error', function(e) {
    console.error('Application Error:', e.error);
    showNotification('Something went wrong. Please try again.', 'error');
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(\`⚡ App loaded in \${loadTime}ms\`);
    });
}

console.log('✅ Professional Web Application Ready');`;
  }

  // Cloud storage operations
  async saveProject(projectName: string, code: {html: string, css: string, js: string}): Promise<boolean> {
    try {
      const projectData = {
        name: projectName,
        code,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      await this.puter.fs.write(`projects/${projectName}.json`, JSON.stringify(projectData, null, 2));
      console.log(`💾 Project "${projectName}" saved to cloud successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error saving project:', error);
      return false;
    }
  }

  async loadProject(projectName: string): Promise<{html: string, css: string, js: string} | null> {
    try {
      const fileContent = await this.puter.fs.read(`projects/${projectName}.json`);
      const projectData = JSON.parse(await fileContent.text());
      console.log(`📂 Project "${projectName}" loaded from cloud`);
      return projectData.code;
    } catch (error) {
      console.error('❌ Error loading project:', error);
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
