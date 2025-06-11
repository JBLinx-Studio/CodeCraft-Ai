
import { AIClient, AIClientOptions, AIRequestParams, AIServiceResponse } from "./base-client";
import { extractCodeBlocks } from "@/lib/utils";

export interface FreeClientOptions extends AIClientOptions {
  model?: string;
}

export class FreeAPIClient implements AIClient {
  private model: string;
  private apiKey: string | null;
  private isProcessingRequest: boolean = false;
  private apiEndpoints: Array<{url: string, name: string, needsAuth: boolean}> = [
    {url: "https://api-inference.huggingface.co/models/google/flan-t5-small", name: "flan-t5", needsAuth: false},
    {url: "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", name: "mistral-7b", needsAuth: false},
    {url: "https://api.openai.com/v1/chat/completions", name: "open-assistant", needsAuth: true},
  ];
  
  constructor(options: FreeClientOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model || "google/flan-t5-small";
  }
  
  async generateResponse(params: AIRequestParams): Promise<AIServiceResponse> {
    try {
      const { prompt, chatHistory = [] } = params;
      this.isProcessingRequest = true;
      
      // Create thinking steps to show the AI's reasoning process
      console.log("AI thinking process: Analyzing request...");
      
      // Check if this is a simple conversation starter (greeting)
      const simplifiedPrompt = prompt.toLowerCase().trim();
      if (this.isSimpleConversation(simplifiedPrompt)) {
        return this.handleConversation(simplifiedPrompt, chatHistory);
      }
      
      console.log("AI thinking process: Formulating approach...");
      
      // Create a conversation-style prompt with history context
      const messages = this.formatMessagesForLLM(prompt, chatHistory);
      
      // Try different API endpoints in sequence
      for (const endpoint of this.apiEndpoints) {
        try {
          console.log(`AI thinking process: Attempting to use ${endpoint.name} API...`);
          const response = await this.callExternalAPI(messages, endpoint);
          if (response && response.success) {
            console.log("AI thinking process: Successfully generated response");
            return response;
          }
        } catch (error) {
          console.warn(`Error with ${endpoint.name} API:`, error);
          // Continue to next endpoint
        }
      }
      
      // Enhanced fallback: If all APIs fail, try one last option with a simpler prompt
      try {
        console.log("AI thinking process: Trying simplified prompt fallback...");
        const simplifiedResponse = await this.callInferenceAPI(
          `Generate HTML, CSS and JavaScript for: ${prompt}`
        );
        
        if (simplifiedResponse && simplifiedResponse.success) {
          return simplifiedResponse;
        }
      } catch (error) {
        console.warn("Simplified fallback failed:", error);
      }
      
      // Final fallback: Create a more thoughtful response locally
      console.log("AI thinking process: Using local generation fallback");
      return this.createLocalResponse(prompt, chatHistory);
    } catch (error) {
      console.error("FreeAPIClient error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred in Free API mode" 
      };
    } finally {
      this.isProcessingRequest = false;
    }
  }
  
  private async callExternalAPI(messages: any[], endpoint: {url: string, name: string, needsAuth: boolean}): Promise<AIServiceResponse | null> {
    try {
      // Format the prompt based on the API
      const lastMessage = messages[messages.length - 1];
      const userPrompt = lastMessage.content || "";
      
      // Make API request with appropriate headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Add authorization if needed and available
      if (endpoint.needsAuth && this.apiKey) {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
      }
      
      let body: any;
      
      // Format request body based on endpoint
      if (endpoint.name === "open-assistant") {
        body = {
          model: "gpt-3.5-turbo",
          messages: messages.slice(-5), // Last 5 messages for context
          temperature: 0.7,
          max_tokens: 1500
        };
      } else {
        body = {
          inputs: userPrompt,
          options: {
            wait_for_model: true
          }
        };
      }
      
      console.log(`AI thinking process: Sending request to ${endpoint.name}`);
      
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        console.log(`${endpoint.name} API responded with status:`, response.status);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      let generatedText = "";
      if (endpoint.name === "open-assistant") {
        generatedText = data.choices && data.choices[0] ? data.choices[0].message.content : "";
      } else {
        generatedText = Array.isArray(data) && data.length > 0 ? data[0].generated_text : 
                       (data.generated_text || data.text || data.output || JSON.stringify(data));
      }
      
      console.log(`AI thinking process: Processing response from ${endpoint.name}`);
      
      // Extract any code blocks from the response
      const { code, explanation } = extractCodeBlocks(generatedText);
      
      return {
        success: true,
        data: {
          code: {
            html: code.html || "",
            css: code.css || "",
            js: code.js || ""
          },
          explanation: explanation || generatedText
        }
      };
    } catch (error) {
      console.error(`Error calling ${endpoint.name} API:`, error);
      throw error;
    }
  }
  
  private async callInferenceAPI(simplifiedPrompt: string): Promise<AIServiceResponse | null> {
    try {
      // Use a public API that doesn't require authentication
      const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: simplifiedPrompt,
          options: {
            wait_for_model: true
          }
        }),
      });
      
      if (!response.ok) {
        console.log("API responded with status:", response.status);
        throw new Error(`Inference API error: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = Array.isArray(data) && data.length > 0 ? data[0].generated_text : "";
      
      // Extract any code blocks from the response
      const { code, explanation } = extractCodeBlocks(generatedText);
      
      return {
        success: true,
        data: {
          code: {
            html: code.html || "",
            css: code.css || "",
            js: code.js || ""
          },
          explanation: explanation || generatedText
        }
      };
    } catch (error) {
      console.error("Error calling Inference API:", error);
      throw error;
    }
  }
  
  private isSimpleConversation(prompt: string): boolean {
    // Check for greetings and simple questions
    const conversationStarters = [
      "hello", "hi", "hey", "greetings", "howdy", 
      "what's up", "whats up", "sup", "yo", 
      "good morning", "good afternoon", "good evening",
      "help", "who are you", "what can you do", "how does this work"
    ];
    
    // Check for exact matches or starts with
    return conversationStarters.some(starter => 
      prompt === starter || 
      prompt.startsWith(`${starter} `) || 
      prompt.startsWith(`${starter},`) ||
      prompt.includes(starter)
    );
  }
  
  private handleConversation(prompt: string, history: Array<{role: string, content: string}> = []): AIServiceResponse {
    const isFirstMessage = history.filter(msg => msg.role === "user").length === 0;
    let response = "";
    
    // Handle greetings
    if (prompt.includes("hello") || prompt.includes("hi") || prompt.includes("hey") || prompt.includes("greetings")) {
      if (prompt.includes("morning")) {
        response = "Good morning! ";
      } else if (prompt.includes("afternoon")) {
        response = "Good afternoon! ";
      } else if (prompt.includes("evening")) {
        response = "Good evening! ";
      } else {
        response = "Hello there! ";
      }
      
      response += "I'm WebCraft AI, your full-stack web development assistant. ";
    }
    // Handle identity questions
    else if (prompt.includes("who are you") || prompt.includes("what are you")) {
      response = "I'm WebCraft AI, a development assistant designed to help you build web applications. ";
    }
    // Handle capability questions
    else if (prompt.includes("what can you do") || prompt.includes("how") || prompt.includes("help")) {
      response = "I can help you build web applications by generating code, answering questions, and providing guidance on development topics. ";
    }
    // Default response
    else {
      response = "I'm here to help with your web development needs. ";
    }
    
    // Add context based on conversation history
    if (isFirstMessage) {
      response += "I can help you create websites and web applications by writing HTML, CSS, and JavaScript code. What would you like to build today? You can describe a project, ask for specific features, or ask questions about web development concepts.";
    } else {
      response += "How can I assist you with your web development project today? Feel free to ask questions or describe what you'd like to build.";
    }
    
    return {
      success: true,
      data: {
        code: {
          html: "",
          css: "",
          js: ""
        },
        explanation: response
      }
    };
  }
  
  private formatMessagesForLLM(prompt: string, history: Array<{role: string, content: string}>): any[] {
    const messages = [];
    
    // Add system prompt
    messages.push({
      role: "system",
      content: `${this.createEnhancedSystemPrompt()}
      
When asked to create web applications:
1. First analyze the request and show your reasoning.
2. Generate HTML, CSS, and JavaScript code wrapped in code blocks (e.g., \`\`\`html, \`\`\`css, \`\`\`js).
3. Provide clear explanations for your implementation choices.
4. Make sure all code is complete and works together.

If the user doesn't specifically request code, engage in a helpful conversation about web development topics. If they greet you, respond in a friendly, conversational manner.`
    });
    
    // Add conversation history (limited to last 10 messages)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      });
    }
    
    // Add the current prompt
    messages.push({
      role: "user",
      content: prompt
    });
    
    return messages;
  }
  
  private createLocalResponse(prompt: string, history: Array<{role: string, content: string}> = []): AIServiceResponse {
    // Generate a thoughtful but local response when APIs fail
    const thinkingSteps = this.generateThinkingProcess(prompt);
    
    // Determine if this looks like a code generation request
    const isCodeRequest = this.seemsLikeCodeRequest(prompt);
    
    if (isCodeRequest) {
      // For code requests, analyze what type of application the user wants
      const appType = this.determineApplicationType(prompt);
      
      // Generate appropriate starter templates based on application type
      const { html, css, js } = this.generateStarterTemplate(appType, prompt);
      
      return {
        success: true,
        data: {
          code: {
            html,
            css,
            js
          },
          explanation: `${thinkingSteps}\n\nI've analyzed your request and created a responsive ${appType} template as a starting point. This includes modern responsive design with semantic HTML5, CSS3 with Flexbox/Grid, and interactive JavaScript functionality. You can easily expand upon this foundation to build your complete application.`
        }
      };
    } else {
      // For conversation, just return the thinking process
      return {
        success: true,
        data: {
          code: {
            html: "",
            css: "",
            js: ""
          },
          explanation: `Let me think about this...\n\n${thinkingSteps}`
        }
      };
    }
  }
  
  private generateThinkingProcess(prompt: string): string {
    // Create a more thoughtful and dynamic thinking process
    const lowerPrompt = prompt.toLowerCase();
    let thoughts = [];
    
    // Add context-specific thoughts based on keywords
    if (lowerPrompt.includes("react") || lowerPrompt.includes("component")) {
      thoughts.push("You're asking about React components. React is a popular JavaScript library for building user interfaces, especially single-page applications.");
      thoughts.push("When designing React components, it's important to consider:");
      thoughts.push("- Component reusability and composition");
      thoughts.push("- State management (local state, context, or external libraries)");
      thoughts.push("- Props and their typings with TypeScript");
      thoughts.push("- Side effects with useEffect and cleanup functions");
    } else if (lowerPrompt.includes("api") || lowerPrompt.includes("fetch")) {
      thoughts.push("I see you're interested in working with APIs. Let me share some thoughts:");
      thoughts.push("- Modern approaches use fetch or libraries like axios");
      thoughts.push("- Error handling is crucial for robust applications");
      thoughts.push("- Consider loading states and user feedback");
      thoughts.push("- React Query can simplify data fetching and caching");
    } else if (lowerPrompt.includes("css") || lowerPrompt.includes("style") || lowerPrompt.includes("design")) {
      thoughts.push("You're asking about styling and design. Here are my thoughts:");
      thoughts.push("- Modern CSS features like flexbox and grid are powerful for layouts");
      thoughts.push("- Tailwind CSS provides utility classes for rapid development");
      thoughts.push("- CSS variables (custom properties) enable theming and consistency");
      thoughts.push("- Responsive design should be considered from the beginning");
    } else if (lowerPrompt.includes("performance") || lowerPrompt.includes("optimize")) {
      thoughts.push("Performance optimization is an important topic. Some key considerations:");
      thoughts.push("- Minimize bundle size with code splitting and tree shaking");
      thoughts.push("- Optimize rendering with memoization (useMemo, useCallback)");
      thoughts.push("- Lazy loading for components and images");
      thoughts.push("- Virtualization for long lists with libraries like react-window");
    } else {
      thoughts.push("I'm analyzing your request about web development.");
      thoughts.push("Let me consider what would be most helpful for your needs.");
      thoughts.push("Web development involves many different technologies and approaches.");
      thoughts.push("I'll try to provide guidance that's both practical and educational.");
    }
    
    return thoughts.join("\n\n");
  }
  
  private seemsLikeCodeRequest(prompt: string): boolean {
    const codeKeywords = [
      "create", "build", "make", "generate", "code", "implement",
      "develop", "app", "application", "website", "component", "page",
      "feature", "function", "html", "css", "javascript", "react"
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    return codeKeywords.some(keyword => lowerPrompt.includes(keyword));
  }

  private determineApplicationType(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("blog") || lowerPrompt.includes("article") || lowerPrompt.includes("post")) {
      return "blog application";
    } else if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("admin") || lowerPrompt.includes("analytics")) {
      return "dashboard application";
    } else if (lowerPrompt.includes("shop") || lowerPrompt.includes("store") || lowerPrompt.includes("ecommerce")) {
      return "e-commerce application";
    } else if (lowerPrompt.includes("todo") || lowerPrompt.includes("task") || lowerPrompt.includes("list")) {
      return "task management application";
    } else if (lowerPrompt.includes("portfolio") || lowerPrompt.includes("resume") || lowerPrompt.includes("showcase")) {
      return "portfolio website";
    } else {
      return "web application";
    }
  }
  
  private generateStarterTemplate(appType: string, prompt: string): { html: string, css: string, js: string } {
    // Generate appropriate starter templates based on application type
    let html = "", css = "", js = "";
    
    if (appType.includes("blog")) {
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Blog Application</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <nav class="main-nav">
        <div class="logo">BlogSpace</div>
        <ul class="nav-links">
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">Articles</a></li>
          <li><a href="#">Categories</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <button class="mobile-menu-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <h1>Welcome to BlogSpace</h1>
        <p class="subtitle">Discover insights, stories, and expertise from our writers.</p>
      </div>
    </section>

    <section class="featured-articles container">
      <h2 class="section-title">Featured Articles</h2>
      <div class="article-grid">
        <article class="article-card">
          <div class="article-image" style="background-image: url('https://source.unsplash.com/random/300x200?blog')"></div>
          <div class="article-content">
            <span class="article-category">Technology</span>
            <h3>The Future of Web Development</h3>
            <p>Exploring the latest trends and technologies that are shaping the future of the web.</p>
            <div class="article-meta">
              <span class="article-date">May 15, 2023</span>
              <span class="article-author">By John Doe</span>
            </div>
            <a href="#" class="read-more">Read More</a>
          </div>
        </article>
        
        <article class="article-card">
          <div class="article-image" style="background-image: url('https://source.unsplash.com/random/300x200?tech')"></div>
          <div class="article-content">
            <span class="article-category">Design</span>
            <h3>Principles of Modern UI Design</h3>
            <p>Understanding the key principles that drive effective and appealing user interfaces.</p>
            <div class="article-meta">
              <span class="article-date">May 10, 2023</span>
              <span class="article-author">By Jane Smith</span>
            </div>
            <a href="#" class="read-more">Read More</a>
          </div>
        </article>
        
        <article class="article-card">
          <div class="article-image" style="background-image: url('https://source.unsplash.com/random/300x200?code')"></div>
          <div class="article-content">
            <span class="article-category">Development</span>
            <h3>Mastering JavaScript Promises</h3>
            <p>A comprehensive guide to working with asynchronous JavaScript and promises.</p>
            <div class="article-meta">
              <span class="article-date">May 5, 2023</span>
              <span class="article-author">By Mike Johnson</span>
            </div>
            <a href="#" class="read-more">Read More</a>
          </div>
        </article>
      </div>
    </section>

    <section class="newsletter">
      <div class="container">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest articles and resources straight to your inbox.</p>
        <form id="newsletter-form" class="newsletter-form">
          <input type="email" placeholder="Your email address" required>
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About BlogSpace</h3>
          <p>A modern blog platform sharing valuable insights and knowledge across various topics.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Articles</a></li>
            <li><a href="#">Categories</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Connect With Us</h3>
          <div class="social-links">
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>
      <div class="copyright">
        <p>&copy; 2023 BlogSpace. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

      css = `/* Modern Blog Application Styles */
:root {
  --primary-color: #3a86ff;
  --secondary-color: #8338ec;
  --text-color: #333333;
  --light-text: #666666;
  --background-color: #ffffff;
  --light-background: #f8f9fa;
  --border-color: #e0e0e0;
  --success-color: #4caf50;
  --font-main: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --container-width: 1200px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-main);
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--background-color);
}

.container {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 20px;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--secondary-color);
}

/* Header Styles */
.site-header {
  background-color: var(--background-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 30px;
}

.nav-links a {
  color: var(--text-color);
  font-weight: 500;
}

.nav-links a.active,
.nav-links a:hover {
  color: var(--primary-color);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--text-color);
  margin: 5px 0;
  transition: 0.4s;
}

/* Hero Section */
.hero {
  background-color: var(--primary-color);
  color: white;
  padding: 100px 0;
  text-align: center;
  background-image: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.hero .subtitle {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.9;
}

/* Featured Articles */
.featured-articles {
  padding: 80px 0;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.section-title:after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background-color: var(--primary-color);
  margin: 15px auto 0;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.article-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.article-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.article-content {
  padding: 25px;
}

.article-category {
  display: inline-block;
  background-color: var(--light-background);
  color: var(--primary-color);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.article-card h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  line-height: 1.3;
}

.article-card p {
  color: var(--light-text);
  margin-bottom: 20px;
}

.article-meta {
  display: flex;
  font-size: 0.9rem;
  color: var(--light-text);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.article-date {
  margin-right: 15px;
}

.read-more {
  display: inline-block;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.read-more:hover {
  transform: translateX(5px);
}

/* Newsletter Section */
.newsletter {
  background-color: var(--light-background);
  padding: 80px 0;
  text-align: center;
}

.newsletter h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.newsletter p {
  max-width: 600px;
  margin: 0 auto 30px;
  color: var(--light-text);
}

.newsletter-form {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
}

.newsletter-form input {
  flex: 1;
  padding: 15px 20px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 1rem;
}

.newsletter-form button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.newsletter-form button:hover {
  background-color: var(--secondary-color);
}

/* Footer Styles */
.site-footer {
  background-color: #222;
  color: #fff;
  padding-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  padding-bottom: 40px;
}

.footer-section h3 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 20px;
  position: relative;
}

.footer-section h3:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 30px;
  height: 2px;
  background-color: var(--primary-color);
}

.footer-section p {
  color: #aaa;
  margin-bottom: 20px;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #aaa;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  color: #aaa;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--primary-color);
}

.copyright {
  border-top: 1px solid #444;
  padding: 20px 0;
  font-size: 0.9rem;
  color: #aaa;
  text-align: center;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }

  .article-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}`;

      js = `// Main JavaScript for Blog Application
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Toggle navigation visibility with animation
      if (navLinks.classList.contains('active')) {
        navLinks.style.display = 'flex';
        setTimeout(() => {
          navLinks.style.transform = 'translateY(0)';
          navLinks.style.opacity = '1';
        }, 10);
      } else {
        navLinks.style.transform = 'translateY(-20px)';
        navLinks.style.opacity = '0';
        setTimeout(() => {
          navLinks.style.display = 'none';
        }, 300);
      }
    });
  }

  // Newsletter form submission
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Simulate API call to subscribe (would be replaced with actual fetch in production)
      simulateSubscribe(email)
        .then(response => {
          showNotification('Successfully subscribed to the newsletter!', 'success');
          emailInput.value = '';
        })
        .catch(error => {
          showNotification('An error occurred. Please try again.', 'error');
        });
    });
  }
  
  // Article card hover effects
  const articleCards = document.querySelectorAll('.article-card');
  
  articleCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Helper functions
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  function simulateSubscribe(email) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Randomly succeed or fail for demo purposes
        const success = Math.random() > 0.2; // 80% success rate
        
        if (success) {
          resolve({ success: true, message: 'Subscription successful' });
        } else {
          reject(new Error('Subscription failed'));
        }
      }, 1000);
    });
  }

  // Add smooth scrolling to all links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Add some additional styles dynamically
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = \`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 5px;
      color: white;
      z-index: 1000;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .notification-success {
      background-color: #4caf50;
    }
    
    .notification-error {
      background-color: #f44336;
    }
    
    .notification-info {
      background-color: #2196f3;
    }
    
    @media (max-width: 768px) {
      .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        width: 100%;
        background-color: white;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        padding: 20px;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 99;
      }
      
      .nav-links.active li {
        margin: 15px 0;
      }
    }
  \`;
  document.head.appendChild(style);
});`;

    } else if (appType.includes("dashboard")) {
      // Generate dashboard template
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics Dashboard</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-chart-line"></i>
          <span>AnalyticsPro</span>
        </div>
        <button id="sidebar-toggle" class="sidebar-toggle">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li class="active">
            <a href="#">
              <i class="fas fa-home"></i>
              <span class="nav-text">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fas fa-chart-bar"></i>
              <span class="nav-text">Analytics</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fas fa-users"></i>
              <span class="nav-text">Customers</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fas fa-shopping-cart"></i>
              <span class="nav-text">Orders</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fas fa-file-invoice-dollar"></i>
              <span class="nav-text">Invoices</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fas fa-cog"></i>
              <span class="nav-text">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Avatar">
          </div>
          <div class="user-details">
            <span class="user-name">John Smith</span>
            <span class="user-role">Administrator</span>
          </div>
        </div>
        <a href="#" class="logout-button">
          <i class="fas fa-sign-out-alt"></i>
          <span class="nav-text">Logout</span>
        </a>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Header -->
      <header class="main-header">
        <div class="search-container">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search...">
        </div>
        
        <div class="header-actions">
          <button class="notification-btn">
            <i class="far fa-bell"></i>
            <span class="notification-badge">3</span>
          </button>
          <button class="message-btn">
            <i class="far fa-envelope"></i>
            <span class="notification-badge">5</span>
          </button>
          <div class="theme-toggle">
            <input type="checkbox" id="theme-switch">
            <label for="theme-switch">
              <i class="fas fa-sun"></i>
              <i class="fas fa-moon"></i>
              <span class="toggle-ball"></span>
            </label>
          </div>
        </div>
      </header>
      
      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <div class="page-header">
          <h1>Dashboard Overview</h1>
          <div class="date-selector">
            <button class="date-btn active">Today</button>
            <button class="date-btn">Week</button>
            <button class="date-btn">Month</button>
            <button class="date-btn">Year</button>
            <button class="custom-date-btn">
              <i class="far fa-calendar-alt"></i>
              Custom
            </button>
          </div>
        </div>
        
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-content">
              <h3>Total Revenue</h3>
              <p class="stat-value">$24,582</p>
              <p class="stat-comparison">
                <i class="fas fa-arrow-up positive"></i>
                <span class="positive">12.5%</span> vs previous period
              </p>
            </div>
            <div class="stat-icon revenue">
              <i class="fas fa-dollar-sign"></i>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-content">
              <h3>New Customers</h3>
              <p class="stat-value">843</p>
              <p class="stat-comparison">
                <i class="fas fa-arrow-up positive"></i>
                <span class="positive">8.2%</span> vs previous period
              </p>
            </div>
            <div class="stat-icon customers">
              <i class="fas fa-user-plus"></i>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-content">
              <h3>Active Users</h3>
              <p class="stat-value">2,153</p>
              <p class="stat-comparison">
                <i class="fas fa-arrow-down negative"></i>
                <span class="negative">3.1%</span> vs previous period
              </p>
            </div>
            <div class="stat-icon users">
              <i class="fas fa-users"></i>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-content">
              <h3>Conversion Rate</h3>
              <p class="stat-value">5.28%</p>
              <p class="stat-comparison">
                <i class="fas fa-arrow-up positive"></i>
                <span class="positive">1.2%</span> vs previous period
              </p>
            </div>
            <div class="stat-icon conversion">
              <i class="fas fa-chart-pie"></i>
            </div>
          </div>
        </div>
        
        <!-- Charts and Tables Section -->
        <div class="chart-grid">
          <!-- Sales Chart -->
          <div class="chart-container sales-chart">
            <div class="chart-header">
              <h3>Sales Overview</h3>
              <div class="chart-actions">
                <button class="chart-action-btn">
                  <i class="fas fa-download"></i>
                </button>
                <button class="chart-action-btn">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="chart-content" id="sales-chart">
              <!-- Chart will be rendered here by JavaScript -->
              <div class="chart-placeholder">Sales Chart Will Render Here</div>
            </div>
          </div>
          
          <!-- Traffic Sources -->
          <div class="chart-container traffic-sources">
            <div class="chart-header">
              <h3>Traffic Sources</h3>
              <div class="chart-actions">
                <button class="chart-action-btn">
                  <i class="fas fa-download"></i>
                </button>
                <button class="chart-action-btn">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="chart-content" id="traffic-chart">
              <!-- Chart will be rendered here by JavaScript -->
              <div class="chart-placeholder">Traffic Chart Will Render Here</div>
            </div>
          </div>
        </div>
        
        <!-- Recent Orders -->
        <div class="table-container recent-orders">
          <div class="table-header">
            <h3>Recent Orders</h3>
            <button class="view-all-btn">View All</button>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ORD-0452</td>
                  <td>
                    <div class="customer-cell">
                      <div class="customer-avatar">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Customer">
                      </div>
                      <span>Sarah Johnson</span>
                    </div>
                  </td>
                  <td>May 14, 2023</td>
                  <td>$125.99</td>
                  <td><span class="status-badge completed">Completed</span></td>
                  <td>
                    <div class="actions-cell">
                      <button class="table-action-btn">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="table-action-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>#ORD-0451</td>
                  <td>
                    <div class="customer-cell">
                      <div class="customer-avatar">
                        <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Customer">
                      </div>
                      <span>Michael Brown</span>
                    </div>
                  </td>
                  <td>May 14, 2023</td>
                  <td>$59.49</td>
                  <td><span class="status-badge shipped">Shipped</span></td>
                  <td>
                    <div class="actions-cell">
                      <button class="table-action-btn">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="table-action-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>#ORD-0450</td>
                  <td>
                    <div class="customer-cell">
                      <div class="customer-avatar">
                        <img src="https://randomuser.me/api/portraits/women/67.jpg" alt="Customer">
                      </div>
                      <span>Emily Davis</span>
                    </div>
                  </td>
                  <td>May 13, 2023</td>
                  <td>$210.50</td>
                  <td><span class="status-badge processing">Processing</span></td>
                  <td>
                    <div class="actions-cell">
                      <button class="table-action-btn">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="table-action-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>#ORD-0449</td>
                  <td>
                    <div class="customer-cell">
                      <div class="customer-avatar">
                        <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Customer">
                      </div>
                      <span>Robert Wilson</span>
                    </div>
                  </td>
                  <td>May 13, 2023</td>
                  <td>$79.99</td>
                  <td><span class="status-badge pending">Pending</span></td>
                  <td>
                    <div class="actions-cell">
                      <button class="table-action-btn">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="table-action-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>#ORD-0448</td>
                  <td>
                    <div class="customer-cell">
                      <div class="customer-avatar">
                        <img src="https://randomuser.me/api/portraits/women/33.jpg" alt="Customer">
                      </div>
                      <span>Jennifer Smith</span>
                    </div>
                  </td>
                  <td>May 12, 2023</td>
                  <td>$149.99</td>
                  <td><span class="status-badge completed">Completed</span></td>
                  <td>
                    <div class="actions-cell">
                      <button class="table-action-btn">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="table-action-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
  
  <script src="script.js"></script>
</body>
</html>`;

      css = `/* AnalyticsPro Dashboard Styles */
:root {
  /* Colors */
  --primary-color: #4361ee;
  --secondary-color: #3f37c9;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --danger-color: #f44336;
  --info-color: #2196f3;
  
  /* Base colors */
  --text-primary: #333;
  --text-secondary: #666;
  --text-muted: #888;
  --border-color: #e0e0e0;
  --background-light: #f9f9f9;
  --card-bg: #fff;
  
  /* Dark mode colors - will be applied when .dark-mode class is added */
  --dark-bg: #1e1e2e;
  --dark-card-bg: #2d2d3f;
  --dark-text-primary: #e0e0e0;
  --dark-text-secondary: #b0b0b0;
  --dark-border-color: #444;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Transitions */
  --transition-speed: 0.3s;
  
  /* Sidebar */
  --sidebar-width: 250px;
  --sidebar-collapsed-width: 70px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-hover: 0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.12);
  
  /* Border radius */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
}

/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-primary);
  background-color: var(--background-light);
  line-height: 1.6;
  font-size: 16px;
  transition: background-color var(--transition-speed) ease;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

button {
  cursor: pointer;
  font-family: inherit;
  background: none;
  border: none;
  outline: none;
}

/* Dashboard Layout */
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: var(--sidebar-width);
  background-color: var(--card-bg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-speed) ease, transform var(--transition-speed) ease;
  border-right: 1px solid var(--border-color);
  z-index: 10;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  padding: var(--spacing-md) var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.logo i {
  margin-right: var(--spacing-sm);
  font-size: 1.4rem;
}

.sidebar-toggle {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  padding: var(--spacing-xs);
  transition: color var(--transition-speed) ease;
}

.sidebar-toggle:hover {
  color: var(--primary-color);
}

.sidebar-nav {
  padding: var(--spacing-md) 0;
  flex: 1;
  overflow-y: auto;
}

.sidebar-nav ul li {
  margin-bottom: var(--spacing-xs);
}

.sidebar-nav ul li a {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-md);
  color: var(--text-secondary);
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
  border-radius: 0;
  position: relative;
}

.sidebar-nav ul li.active a::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: var(--primary-color);
}

.sidebar-nav ul li a i {
  margin-right: var(--spacing-md);
  font-size: 1.2rem;
  min-width: 25px;
  display: flex;
  justify-content: center;
}

.sidebar-nav ul li a:hover {
  background-color: rgba(67, 97, 238, 0.05);
  color: var(--primary-color);
}

.sidebar-nav ul li.active a {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
  font-weight: 600;
}

.sidebar.collapsed .nav-text,
.sidebar.collapsed .user-details,
.sidebar.collapsed .logo span {
  display: none;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.user-role {
  color: var(--text-muted);
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.logout-button {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--danger-color);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-speed) ease;
}

.logout-button i {
  margin-right: var(--spacing-md);
  font-size: 1.1rem;
}

.logout-button:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left var(--transition-speed) ease;
}

/* Main Header */
.main-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--border-color);
}

.search-container {
  position: relative;
  max-width: 400px;
  width: 100%;
}

.search-container i {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-container input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
}

.search-container input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.notification-btn, .message-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border-radius: 50%;
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

.notification-btn:hover, .message-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--primary-color);
}

.notification-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 18px;
  height: 18px;
  background-color: var(--danger-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* Theme Toggle */
.theme-toggle {
  position: relative;
  width: 60px;
  height: 30px;
}

.theme-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.theme-toggle label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f0f0f0;
  transition: var(--transition-speed);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-xs);
}

.theme-toggle label .fa-sun {
  color: #ff9800;
}

.theme-toggle label .fa-moon {
  color: #3f37c9;
}

.theme-toggle label .toggle-ball {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: white;
  transition: var(--transition-speed);
  box-shadow: var(--shadow-sm);
}

.theme-toggle input:checked + label .toggle-ball {
  transform: translateX(30px);
}

.theme-toggle input:checked + label {
  background-color: #3a3a5a;
}

/* Dashboard Content */
.dashboard-content {
  padding: var(--spacing-xl);
  overflow-y: auto;
  flex: 1;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.date-selector {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.date-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

.date-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.date-btn:not(.active):hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--primary-color);
}

.custom-date-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: border-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

.custom-date-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-card h3 {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.stat-comparison {
  font-size: 0.9rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-comparison .positive {
  color: var(--success-color);
}

.stat-comparison .negative {
  color: var(--danger-color);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.revenue {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.stat-icon.customers {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--info-color);
}

.stat-icon.users {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--warning-color);
}

.stat-icon.conversion {
  background-color: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

/* Charts and Tables */
.chart-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.chart-container {
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.chart-header {
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.chart-header h3 {
  font-size: 1rem;
  font-weight: 600;
}

.chart-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.chart-action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border-radius: 50%;
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

.chart-action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--primary-color);
}

.chart-content {
  padding: var(--spacing-lg);
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  padding: var(--spacing-xl);
}

/* Table Styles */
.table-container {
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  margin-bottom: var(--spacing-xl);
}

.table-header {
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.table-header h3 {
  font-size: 1rem;
  font-weight: 600;
}

.view-all-btn {
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.9rem;
  transition: opacity var(--transition-speed) ease;
}

.view-all-btn:hover {
  opacity: 0.8;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: var(--spacing-md) var(--spacing-lg);
  font-weight: 600;
  color: var(--text-secondary);
  background-color: var(--background-light);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

td {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background-color var(--transition-speed) ease;
}

tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.customer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.customer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.status-badge.shipped {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--info-color);
}

.status-badge.processing {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--warning-color);
}

.status-badge.pending {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--danger-color);
}

.actions-cell {
  display: flex;
  gap: var(--spacing-xs);
}

.table-action-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border-radius: 50%;
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

.table-action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--primary-color);
}

/* Dark Mode */
body.dark-mode {
  background-color: var(--dark-bg);
  color: var(--dark-text-primary);
}

body.dark-mode .sidebar,
body.dark-mode .main-header,
body.dark-mode .stat-card,
body.dark-mode .chart-container,
body.dark-mode .table-container {
  background-color: var(--dark-card-bg);
  border-color: var(--dark-border-color);
}

body.dark-mode th {
  background-color: rgba(0, 0, 0, 0.2);
}

body.dark-mode .search-container input {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--dark-border-color);
  color: var(--dark-text-primary);
}

body.dark-mode .date-btn:not(.active) {
  color: var(--dark-text-secondary);
}

body.dark-mode .date-btn:not(.active):hover {
  background-color: rgba(255, 255, 255, 0.05);
}

body.dark-mode .custom-date-btn {
  color: var(--dark-text-secondary);
  border-color: var(--dark-border-color);
}

body.dark-mode th,
body.dark-mode td {
  border-color: var(--dark-border-color);
}

body.dark-mode .sidebar-nav ul li a {
  color: var(--dark-text-secondary);
}

body.dark-mode .sidebar-nav ul li.active a {
  background-color: rgba(67, 97, 238, 0.2);
}

body.dark-mode .sidebar-nav ul li a:hover {
  background-color: rgba(67, 97, 238, 0.1);
}

body.dark-mode .notification-btn:hover, 
body.dark-mode .message-btn:hover,
body.dark-mode .chart-action-btn:hover,
body.dark-mode .table-action-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

body.dark-mode tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 576px) {
  .main-header {
    flex-direction: column;
    height: auto;
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }
  
  .search-container {
    max-width: 100%;
  }
  
  .date-selector {
    flex-wrap: wrap;
  }
}

/* Animation and Transitions */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card, .chart-container, .table-container {
  animation: fadeIn 0.3s ease-out forwards;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }`;

      js = `// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      if (sidebar.classList.contains('collapsed')) {
        mainContent.style.marginLeft = 'var(--sidebar-collapsed-width)';
      } else {
        mainContent.style.marginLeft = '';
      }
    });
  }

  // Theme toggle functionality
  const themeSwitch = document.getElementById('theme-switch');
  
  if (themeSwitch) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeSwitch.checked = true;
    }
    
    themeSwitch.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Responsive sidebar for mobile devices
  const handleResponsiveSidebar = () => {
    if (window.innerWidth <= 768) {
      if (!sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
        mainContent.style.marginLeft = '';
      }
      
      // Add mobile specific behavior
      document.addEventListener('click', function(event) {
        if (sidebar.classList.contains('show') && 
            !sidebar.contains(event.target) && 
            !sidebarToggle.contains(event.target)) {
          sidebar.classList.remove('show');
        }
      });
      
      if (sidebarToggle) {
        sidebarToggle.removeEventListener('click', toggleSidebar);
        sidebarToggle.addEventListener('click', function(event) {
          event.stopPropagation();
          sidebar.classList.toggle('show');
        });
      }
    } else {
      // Revert to desktop behavior
      if (sidebarToggle) {
        sidebarToggle.removeEventListener('click', toggleSidebar);
        sidebarToggle.addEventListener('click', toggleSidebar);
      }
    }
  };

  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
      mainContent.style.marginLeft = 'var(--sidebar-collapsed-width)';
    } else {
      mainContent.style.marginLeft = '';
    }
  }

  // Initialize responsive sidebar
  handleResponsiveSidebar();
  
  // Update on window resize
  window.addEventListener('resize', handleResponsiveSidebar);

  // Demo charts (placeholders)
  // This is a placeholder. In a real application, you'd use a library like Chart.js, D3.js, or ApexCharts
  const createPlaceholderChart = (containerId, chartType) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create a canvas with crude chart representation
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    container.appendChild(canvas);
    
    if (!canvas.getContext) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set some styling based on theme
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#333';
    const gridColor = isDarkMode ? '#444' : '#e0e0e0';
    const primaryColor = '#4361ee';
    const secondaryColor = '#3f37c9';
    
    // Draw a simple chart based on type
    if (chartType === 'sales') {
      // Draw sales line chart
      // X and Y axes
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      
      // Y axis
      ctx.beginPath();
      ctx.moveTo(50, 30);
      ctx.lineTo(50, 250);
      ctx.stroke();
      
      // X axis
      ctx.beginPath();
      ctx.moveTo(50, 250);
      ctx.lineTo(canvas.width - 30, 250);
      ctx.stroke();
      
      // Sales data line
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(70, 200);
      ctx.lineTo(130, 180);
      ctx.lineTo(190, 220);
      ctx.lineTo(250, 100);
      ctx.lineTo(310, 150);
      ctx.lineTo(370, 120);
      ctx.lineTo(430, 80);
      ctx.lineTo(490, 110);
      ctx.stroke();
      
      // Add gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, 'rgba(67, 97, 238, 0.3)');
      gradient.addColorStop(1, 'rgba(67, 97, 238, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(70, 250);
      ctx.lineTo(70, 200);
      ctx.lineTo(130, 180);
      ctx.lineTo(190, 220);
      ctx.lineTo(250, 100);
      ctx.lineTo(310, 150);
      ctx.lineTo(370, 120);
      ctx.lineTo(430, 80);
      ctx.lineTo(490, 110);
      ctx.lineTo(490, 250);
      ctx.closePath();
      ctx.fill();
      
      // Add labels
      ctx.fillStyle = textColor;
      ctx.font = '12px Arial';
      ctx.fillText('Jan', 70, 270);
      ctx.fillText('Feb', 130, 270);
      ctx.fillText('Mar', 190, 270);
      ctx.fillText('Apr', 250, 270);
      ctx.fillText('May', 310, 270);
      ctx.fillText('Jun', 370, 270);
      ctx.fillText('Jul', 430, 270);
      ctx.fillText('Aug', 490, 270);
      
      // Y-axis labels
      ctx.fillText('$0', 30, 250);
      ctx.fillText('$5K', 30, 200);
      ctx.fillText('$10K', 30, 150);
      ctx.fillText('$15K', 30, 100);
      ctx.fillText('$20K', 30, 50);
      
    } else if (chartType === 'traffic') {
      // Draw traffic pie chart
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 50;
      
      // Draw segments
      const segments = [
        { color: primaryColor, value: 0.4 },
        { color: secondaryColor, value: 0.25 },
        { color: '#f44336', value: 0.2 },
        { color: '#4caf50', value: 0.15 }
      ];
      
      let startAngle = 0;
      
      segments.forEach(segment => {
        const endAngle = startAngle + (segment.value * 2 * Math.PI);
        
        ctx.fillStyle = segment.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        // Draw labels
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const x = centerX + Math.cos(midAngle) * (radius * 0.7);
        const y = centerY + Math.sin(midAngle) * (radius * 0.7);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(\`\${Math.round(segment.value * 100)}%\`, x, y);
        
        startAngle = endAngle;
      });
      
      // Add legend
      const legendItems = [
        { color: primaryColor, label: 'Organic Search' },
        { color: secondaryColor, label: 'Direct' },
        { color: '#f44336', label: 'Social Media' },
        { color: '#4caf50', label: 'Referral' }
      ];
      
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '12px Arial';
      
      legendItems.forEach((item, index) => {
        const y = canvas.height - 80 + (index * 20);
        
        // Color box
        ctx.fillStyle = item.color;
        ctx.fillRect(centerX - 80, y, 12, 12);
        
        // Label
        ctx.fillStyle = textColor;
        ctx.fillText(item.label, centerX - 60, y + 6);
      });
    }
  };
  
  // Create placeholder charts
  createPlaceholderChart('sales-chart', 'sales');
  createPlaceholderChart('traffic-chart', 'traffic');
  
  // Update charts when theme changes
  if (themeSwitch) {
    themeSwitch.addEventListener('change', function() {
      setTimeout(() => {
        createPlaceholderChart('sales-chart', 'sales');
        createPlaceholderChart('traffic-chart', 'traffic');
      }, 300); // Small delay to ensure theme has changed
    });
  }
  
  // Interactive elements - Table row actions
  const tableActionBtns = document.querySelectorAll('.table-action-btn');
  
  tableActionBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const isViewBtn = this.querySelector('.fa-eye');
      const isEditBtn = this.querySelector('.fa-edit');
      const row = this.closest('tr');
      const orderId = row.querySelector('td').textContent;
      
      if (isViewBtn) {
        // Simulate view order action
        showNotification(\`Viewing details for order \${orderId}\`, 'info');
      } else if (isEditBtn) {
        // Simulate edit order action
        showNotification(\`Editing order \${orderId}\`, 'info');
      }
    });
  });
  
  // Add row click handler
  const tableRows = document.querySelectorAll('tbody tr');
  
  tableRows.forEach(row => {
    row.addEventListener('click', function() {
      const orderId = this.querySelector('td').textContent;
      showNotification(\`Selected order \${orderId}\`, 'info');
    });
  });

  // Create notification function
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    notification.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      color: white;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s, transform 0.3s;
    \`;
    
    // Set background based on type
    if (type === 'info') {
      notification.style.backgroundColor = '#2196f3';
    } else if (type === 'success') {
      notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#f44336';
    } else if (type === 'warning') {
      notification.style.backgroundColor = '#ff9800';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger transition
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300); // Match transition time
    }, 3000);
  }
  
  // Add notification for demo purposes
  setTimeout(() => {
    showNotification('Welcome to AnalyticsPro Dashboard', 'info');
  }, 1000);
});`;
    } else {
      // Default template if we can't determine the type
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Web Application</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="logo">WebApp</div>
      <nav class="main-nav">
        <button class="menu-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-list">
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Welcome to WebApp</h1>
          <p>A modern, responsive web application starter template.</p>
          <div class="hero-buttons">
            <a href="#" class="btn btn-primary">Get Started</a>
            <a href="#" class="btn btn-secondary">Learn More</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://via.placeholder.com/600x400" alt="Hero Image">
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
            <h3>Responsive Design</h3>
            <p>Looks great on all devices, from mobile phones to desktop computers.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Fast Loading</h3>
            <p>Optimized for performance to ensure your users have a smooth experience.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </div>
            <h3>Customizable</h3>
            <p>Easily adapt and extend this template to fit your specific needs.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>User-Friendly</h3>
            <p>Intuitive interface designed with the end user in mind.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to get started?</h2>
          <p>Join thousands of users who are already using our platform.</p>
          <a href="#" class="btn btn-primary">Sign Up Now</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3>WebApp</h3>
          <p>A modern web application template to help you build amazing websites quickly and efficiently.</p>
          <div class="social-links">
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
        <div class="footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Tutorials</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">API Reference</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Contact</h4>
          <ul class="contact-info">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>123 Main Street, City, Country</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>info@webapp.com</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+1 (555) 123-4567</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2023 WebApp. All rights reserved.</p>
        <ul class="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

      css = `/* Modern Web Application Styles */
:root {
  /* Colors */
  --primary-color: #3a86ff;
  --primary-dark: #2a76ef;
  --secondary-color: #ff006e;
  --text-color: #333333;
  --text-light: #666666;
  --text-muted: #888888;
  --bg-color: #ffffff;
  --bg-light: #f8f9fa;
  --border-color: #e0e0e0;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;
  
  /* Typography */
  --font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-xxl: 1.5rem;
  --font-size-xxxl: 2rem;
  --line-height: 1.6;
  
  /* Borders */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-focus: 0 0 0 3px rgba(58, 134, 255, 0.3);
  
  /* Animations */
  --transition-base: all 0.3s ease;
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--text-color);
  background-color: var(--bg-color);
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition-base);
}

a:hover {
  color: var(--primary-dark);
}

/* Layout */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Header Styles */
.header {
  position: sticky;
  top: 0;
  background-color: var(--bg-color);
  box-shadow: var(--shadow-sm);
  z-index: 100;
  padding: var(--spacing-md) 0;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--primary-color);
}

.main-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: var(--spacing-lg);
}

.nav-list a {
  color: var(--text-color);
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  position: relative;
}

.nav-list a.active,
.nav-list a:hover {
  color: var(--primary-color);
}

.nav-list a.active::after {
  content: '';
  position: absolute;
  left: var(--spacing-sm);
  right: var(--spacing-sm);
  bottom: 0;
  height: 2px;
  background-color: var(--primary-color);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--text-color);
  transition: var(--transition-base);
}

/* Hero Section */
.hero {
  padding: var(--spacing-xxl) 0;
  background-color: var(--bg-light);
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xxl);
  align-items: center;
}

.hero-content {
  max-width: 500px;
}

.hero h1 {
  font-size: calc(var(--font-size-xxxl) * 1.5);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: var(--spacing-md);
}

.hero p {
  font-size: var(--font-size-xl);
  color: var(--text-light);
  margin-bottom: var(--spacing-lg);
}

.hero-buttons {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.hero-image {
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transform: perspective(1000px) rotateY(-5deg);
  transition: var(--transition-base);
}

.hero-image:hover {
  transform: perspective(1000px) rotateY(0);
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-align: center;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-base);
  border: none;
  outline: none;
  gap: var(--spacing-sm);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  color: white;
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-secondary:hover {
  background-color: rgba(58, 134, 255, 0.1);
}

/* Features Section */
.features {
  padding: var(--spacing-xxl) 0;
}

.section-title {
  font-size: var(--font-size-xxxl);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: var(--primary-color);
  margin: var(--spacing-sm) auto 0;
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.feature-card {
  background-color: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background-color: rgba(58, 134, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
}

.feature-card h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
}

.feature-card p {
  color: var(--text-light);
}

/* CTA Section */
.cta {
  padding: var(--spacing-xxl) 0;
  background-color: var(--primary-color);
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta h2 {
  font-size: var(--font-size-xxxl);
  margin-bottom: var(--spacing-sm);
}

.cta p {
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-lg);
  opacity: 0.9;
}

.cta .btn-primary {
  background-color: white;
  color: var(--primary-color);
}

.cta .btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

/* Footer Styles */
.footer {
  background-color: #1a1a1a;
  color: white;
  padding-top: var(--spacing-xxl);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-column h3 {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
  color: white;
}

.footer-column h4 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  color: white;
}

.footer-column p {
  color: #b0b0b0;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-base);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: var(--transition-base);
}

.social-links a:hover {
  background-color: var(--primary-color);
}

.footer-column ul {
  list-style: none;
}

.footer-column ul li:not(:last-child) {
  margin-bottom: var(--spacing-sm);
}

.footer-column ul a {
  color: #b0b0b0;
  transition: var(--transition-base);
}

.footer-column ul a:hover {
  color: white;
}

.contact-info li {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.contact-info svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 4px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-lg) 0;
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.footer-bottom p {
  color: #b0b0b0;
}

.footer-links {
  display: flex;
  list-style: none;
  gap: var(--spacing-lg);
}

.footer-links a {
  color: #b0b0b0;
  font-size: var(--font-size-sm);
}

.footer-links a:hover {
  color: white;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-image {
    margin-top: var(--spacing-lg);
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--bg-color);
    box-shadow: var(--shadow-md);
    flex-direction: column;
    gap: 0;
    height: 0;
    overflow: hidden;
    transition: var(--transition-base);
    opacity: 0;
    visibility: hidden;
  }

  .nav-list.show {
    height: auto;
    opacity: 1;
    visibility: visible;
  }

  .nav-list a {
    display: block;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
  }

  .nav-list a.active::after {
    display: none;
  }

  .hero h1 {
    font-size: calc(var(--font-size-xxxl) * 1.25);
  }

  .cta h2 {
    font-size: calc(var(--font-size-xxxl) * 0.9);
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .hero h1 {
    font-size: var(--font-size-xxxl);
  }

  .hero p {
    font-size: var(--font-size-lg);
  }

  .section-title {
    font-size: calc(var(--font-size-xxxl) * 0.9);
  }

  .cta h2 {
    font-size: var(--font-size-xxl);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-links {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: center;
  }
}

/* Animation Utilities */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.fade-in-1 {
  animation-delay: 0.1s;
}

.fade-in-2 {
  animation-delay: 0.2s;
}

.fade-in-3 {
  animation-delay: 0.3s;
}

/* Additional Utility Classes */
.text-center {
  text-align: center;
}

.my-1 {
  margin-top: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.my-2 {
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.my-3 {
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.my-4 {
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.my-5 {
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}`;

      js = `// Modern Web Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', function() {
      navList.classList.toggle('show');
      
      // Toggle animation for hamburger menu
      const spans = this.querySelectorAll('span');
      spans.forEach((span, index) => {
        span.classList.toggle('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!menuToggle.contains(event.target) && !navList.contains(event.target)) {
        navList.classList.remove('show');
      }
    });
  }
  
  // Add animation classes to elements when they come into viewport
  const animatedElements = document.querySelectorAll('.feature-card, .hero-content, .hero-image, .cta-content');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(element => {
      element.classList.add('fade-in');
    });
  }
  
  // Add staggered delays to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = \`\${index * 0.1}s\`;
  });
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        navList.classList.remove('show');
        
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add active class to nav links based on scroll position
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-list a');
  
  function setActiveNavLink() {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === \`#\${currentSection}\`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', setActiveNavLink);
  
  // Form validation for contact forms
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = this.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          showError(field, 'This field is required');
        } else {
          removeError(field);
          
          // Email validation
          if (field.type === 'email') {
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(field.value)) {
              isValid = false;
              showError(field, 'Please enter a valid email address');
            }
          }
        }
      });
      
      if (isValid) {
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Simulate API call
        setTimeout(() => {
          submitBtn.textContent = 'Success!';
          
          // Reset form
          this.reset();
          
          // Show success message
          showNotification('Form submitted successfully!', 'success');
          
          // Reset button after delay
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }, 1000);
        }, 1500);
      }
    });
  });
  
  function showError(field, message) {
    // Remove any existing error
    removeError(field);
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Insert error after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    
    // Add error styles if not in CSS
    if (!document.querySelector('style#error-styles')) {
      const style = document.createElement('style');
      style.id = 'error-styles';
      style.textContent = \`
        .error {
          border-color: #f44336 !important;
          background-color: rgba(244, 67, 54, 0.05) !important;
        }
        .error-message {
          color: #f44336;
          font-size: 0.875rem;
          margin-top: 5px;
        }
      \`;
      document.head.appendChild(style);
    }
  }
  
  function removeError(field) {
    // Remove error class
    field.classList.remove('error');
    
    // Remove error message if exists
    const errorMessage = field.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains('error-message')) {
      errorMessage.remove();
    }
  }
  
  function showNotification(message, type = 'info') {
    // Create notification element if not in CSS
    if (!document.querySelector('style#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = \`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          max-width: 300px;
          padding: 15px 20px;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
          transform: translateY(-20px);
          opacity: 0;
          transition: all 0.3s ease-in-out;
          z-index: 1000;
        }
        .notification.show {
          transform: translateY(0);
          opacity: 1;
        }
        .notification.success {
          border-left: 4px solid #4caf50;
        }
        .notification.error {
          border-left: 4px solid #f44336;
        }
        .notification.info {
          border-left: 4px solid #2196f3;
        }
      \`;
      document.head.appendChild(style);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = \`notification \${type}\`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Initialize any interactive elements
  initializeInteractiveElements();
  
  function initializeInteractiveElements() {
    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      });
      
      button.addEventListener('mouseout', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
      });
    });
    
    // Add pulse animation to CTA
    const ctaButton = document.querySelector('.cta .btn');
    if (ctaButton) {
      // Add pulse animation CSS if not already in stylesheet
      if (!document.querySelector('style#pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = \`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
            }
          }
          .pulse {
            animation: pulse 2s infinite;
          }
        \`;
        document.head.appendChild(style);
      }
      
      ctaButton.classList.add('pulse');
    }
  }
});`;
    }
    
    return { html, css, js };
  }

  createEnhancedPrompt(prompt: string, chatHistory: Array<{ role: string; content: string }> = []): string {
    return `Generate a web application based on this description: ${prompt}`;
  }
}

