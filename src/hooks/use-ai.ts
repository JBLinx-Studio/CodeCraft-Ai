
import { useState, useEffect } from "react";
import { AIResponse } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Configuration options
const API_OPTIONS = {
  OPENAI: {
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-3.5-turbo",
  },
  HUGGINGFACE: {
    url: "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
  }
};

// Smart fallback templates are now enhanced with more variety
const TEMPLATES = {
  landing: {
    name: "Landing Page",
    tags: ["marketing", "homepage", "business"],
  },
  portfolio: {
    name: "Portfolio",
    tags: ["personal", "showcase", "resume"],
  },
  blog: {
    name: "Blog",
    tags: ["content", "articles", "posts"],
  },
  ecommerce: {
    name: "E-commerce",
    tags: ["shop", "store", "products", "cart"],
  },
  dashboard: {
    name: "Dashboard",
    tags: ["admin", "analytics", "data", "metrics"],
  },
  social: {
    name: "Social Network",
    tags: ["community", "profiles", "feed"],
  },
  todo: {
    name: "Todo App",
    tags: ["productivity", "tasks", "checklist"],
  },
};

// Define types for API responses to fix TypeScript errors
interface AIServiceSuccessResponse {
  success: true;
  data: {
    code: {
      html?: string;
      css?: string;
      js?: string;
    };
    explanation?: string;
  };
}

interface AIServiceErrorResponse {
  success: false;
  error: string;
}

type AIServiceResponse = AIServiceSuccessResponse | AIServiceErrorResponse;

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiProvider, setApiProvider] = useState<"OPENAI" | "HUGGINGFACE">("HUGGINGFACE");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("webcraft_api_key");
    const storedProvider = localStorage.getItem("webcraft_api_provider") as "OPENAI" | "HUGGINGFACE";
    
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedProvider) setApiProvider(storedProvider);
  }, []);

  const saveApiKey = (key: string, provider: "OPENAI" | "HUGGINGFACE") => {
    localStorage.setItem("webcraft_api_key", key);
    localStorage.setItem("webcraft_api_provider", provider);
    setApiKey(key);
    setApiProvider(provider);
    return true;
  };

  const clearApiKey = () => {
    localStorage.removeItem("webcraft_api_key");
    setApiKey(null);
    return true;
  };

  const addToChatHistory = (message: {role: string, content: string}) => {
    setChatHistory(prev => [...prev, message]);
  };

  const generateCode = async (prompt: string): Promise<AIResponse> => {
    setIsProcessing(true);
    
    // Add user message to chat history
    addToChatHistory({role: "user", content: prompt});
    
    try {
      // If we have an API key, try to use it
      if (apiKey) {
        const response = await callAIService(prompt, apiKey, apiProvider);
        
        if (response.success) {
          // Add assistant response to chat history
          const explanation = response.data.explanation || "Code generated successfully";
          addToChatHistory({role: "assistant", content: explanation});
          return response.data;
        } else {
          // If API call fails, log the error and fall back
          console.error("API call failed:", response.error);
          toast({
            title: "API Error",
            description: response.error || "Error connecting to AI service",
            variant: "destructive",
          });
        }
      }
      
      // Fall back to smart template selection
      const smartFallbackResponse = await smartFallbackGenerator(prompt, chatHistory);
      
      // Add fallback response to chat history
      addToChatHistory({
        role: "assistant", 
        content: smartFallbackResponse.explanation || "Generated based on your request"
      });
      
      return smartFallbackResponse;
    } catch (error) {
      console.error("Error in generateCode:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Using fallback mode.",
        variant: "destructive",
      });
      
      const fallbackResponse = await smartFallbackGenerator(prompt, chatHistory);
      addToChatHistory({
        role: "assistant", 
        content: fallbackResponse.explanation || "Generated with fallback mode"
      });
      return fallbackResponse;
    } finally {
      setIsProcessing(false);
    }
  };

  // Call the AI service based on provider
  const callAIService = async (
    prompt: string, 
    key: string, 
    provider: "OPENAI" | "HUGGINGFACE"
  ): Promise<AIServiceResponse> => {
    try {
      // Create an enhanced prompt for better code generation
      const enhancedPrompt = createEnhancedPrompt(prompt, chatHistory, provider);
      
      if (provider === "OPENAI") {
        const response = await fetch(API_OPTIONS.OPENAI.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({
            model: API_OPTIONS.OPENAI.model,
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
        return parseOpenAIResponse(data);
      } else {
        // HuggingFace implementation
        const response = await fetch(API_OPTIONS.HUGGINGFACE.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({ inputs: enhancedPrompt }),
        });

        if (!response.ok) {
          return { 
            success: false, 
            error: `API responded with status ${response.status}: ${response.statusText}` 
          };
        }

        const data = await response.json();
        return parseHuggingFaceResponse(data);
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  };

  // Create enhanced prompts based on the provider
  const createEnhancedPrompt = (
    userPrompt: string, 
    history: Array<{role: string, content: string}>,
    provider: string
  ) => {
    // Extract keywords from the prompt and previous conversation
    const allText = [
      userPrompt,
      ...history.map(msg => msg.content)
    ].join(" ");
    
    // Extract key features requested
    const features = extractRequestedFeatures(allText);
    const stylePreferences = extractStylePreferences(allText);
    
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
  };

  // Extract features from text using keyword matching
  const extractRequestedFeatures = (text: string) => {
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
  };

  // Extract style preferences from text
  const extractStylePreferences = (text: string) => {
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
  };

  // Parse responses from different AI providers
  const parseOpenAIResponse = (data: any): AIServiceResponse => {
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
  };

  const parseHuggingFaceResponse = (data: any): AIServiceResponse => {
    try {
      // Try to find and parse JSON from the response
      const jsonMatch = data.generated_text?.match(/\{[\s\S]*\}/);
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
      }
      
      // Simple fallback: try to extract code blocks
      const htmlMatch = data.generated_text?.match(/```html([\s\S]*?)```/);
      const cssMatch = data.generated_text?.match(/```css([\s\S]*?)```/);
      const jsMatch = data.generated_text?.match(/```js([\s\S]*?)```/);
      
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
      
      return { success: false, error: "Failed to extract code from response" };
    } catch (error) {
      return { success: false, error: "Error parsing API response" };
    }
  };

  // Enhanced smart fallback generator that's more context-aware
  const smartFallbackGenerator = async (prompt: string, history: Array<{role: string, content: string}>): Promise<AIResponse> => {
    // Analyze prompt to determine what kind of website to generate
    const promptLower = prompt.toLowerCase();
    const historyText = history.map(msg => msg.content).join(" ").toLowerCase();
    const combinedText = promptLower + " " + historyText;
    
    // Determine the best template match based on keywords
    let bestMatch = "landing"; // Default template
    let bestScore = 0;
    
    Object.entries(TEMPLATES).forEach(([templateKey, template]) => {
      let score = 0;
      
      // Check for exact template mentions
      if (combinedText.includes(templateKey)) score += 10;
      
      // Check for tag matches
      template.tags.forEach(tag => {
        if (combinedText.includes(tag)) score += 5;
      });
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = templateKey;
      }
    });
    
    // Extract color preferences
    const colorMatches = {
      blue: combinedText.includes("blue"),
      green: combinedText.includes("green"),
      red: combinedText.includes("red"),
      purple: combinedText.includes("purple"),
      dark: combinedText.includes("dark"),
      light: combinedText.includes("light"),
    };
    
    // Extract feature preferences
    const features = {
      responsive: !combinedText.includes("not responsive"),
      animation: combinedText.includes("animation") || combinedText.includes("animate"),
      form: combinedText.includes("form") || combinedText.includes("contact") || combinedText.includes("input"),
      navigation: !combinedText.includes("no navigation"),
    };
    
    // Now generate the appropriate template with customizations
    switch (bestMatch) {
      case "landing":
        return generateLandingPage(colorMatches, features);
      case "portfolio":
        return generatePortfolioPage(colorMatches, features);
      case "blog":
        return generateBlogPage(colorMatches, features);
      case "ecommerce":
        return generateEcommercePage(colorMatches, features);
      case "dashboard":
        return generateDashboardPage(colorMatches, features);
      case "social":
        return generateSocialPage(colorMatches, features);
      case "todo":
        return generateTodoPage(colorMatches, features);
      default:
        return generateLandingPage(colorMatches, features);
    }
  };
  
  // Generate template functions (implementing one as example, the others would follow a similar pattern)
  const generateLandingPage = (colors: any, features: any) => {
    // Determine primary color based on preferences
    let primaryColor = "#4f46e5"; // Default
    if (colors.blue) primaryColor = "#3b82f6";
    if (colors.green) primaryColor = "#10b981";
    if (colors.red) primaryColor = "#ef4444";
    if (colors.purple) primaryColor = "#8b5cf6";
    
    // Generate the HTML with customizations
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Platform</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="${colors.dark ? 'dark-theme' : ''}">
  ${features.navigation ? `
  <header class="header">
    <div class="container">
      <nav class="nav">
        <div class="logo">WebCraft</div>
        <ul class="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          ${features.form ? '<li><a href="#contact">Contact</a></li>' : ''}
        </ul>
        <button class="mobile-menu-btn" id="menuToggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </div>
  </header>
  ` : ''}

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1 class="${features.animation ? 'animate-fade-in' : ''}">Build Amazing Web Applications</h1>
        <p>The easiest way to bring your ideas to life. No coding required.</p>
        <div class="hero-buttons">
          <button class="btn primary-btn">Get Started</button>
          <button class="btn secondary-btn">Learn More</button>
        </div>
      </div>
      <div class="hero-image">
        <div class="placeholder-image">Web App Preview</div>
      </div>
    </div>
  </section>

  <section id="features" class="features">
    <div class="container">
      <h2 class="section-title">Key Features</h2>
      <div class="features-grid">
        <div class="feature-card ${features.animation ? 'hover-scale' : ''}">
          <div class="feature-icon">🚀</div>
          <h3>Fast Development</h3>
          <p>Build web applications in minutes instead of weeks.</p>
        </div>
        <div class="feature-card ${features.animation ? 'hover-scale' : ''}">
          <div class="feature-icon">🎨</div>
          <h3>Beautiful Design</h3>
          <p>Professional designs that look great on any device.</p>
        </div>
        <div class="feature-card ${features.animation ? 'hover-scale' : ''}">
          <div class="feature-icon">💡</div>
          <h3>Smart AI</h3>
          <p>AI-powered tools that understand your requirements.</p>
        </div>
        <div class="feature-card ${features.animation ? 'hover-scale' : ''}">
          <div class="feature-icon">🔄</div>
          <h3>Real-time Preview</h3>
          <p>See changes instantly as you make them.</p>
        </div>
      </div>
    </div>
  </section>

  ${features.form ? `
  <section id="contact" class="contact">
    <div class="container">
      <h2 class="section-title">Get In Touch</h2>
      <form class="contact-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" placeholder="Your Name">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Your Email">
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" placeholder="Your Message"></textarea>
        </div>
        <button type="submit" class="btn primary-btn">Send Message</button>
      </form>
    </div>
  </section>
  ` : ''}

  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 WebCraft. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

    // Generate the CSS with customizations
    const css = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9fafb;
  transition: background-color 0.3s ease, color 0.3s ease;
}

${colors.dark ? `
.dark-theme {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-theme .header {
  background-color: #1f1f1f;
}

.dark-theme .feature-card {
  background-color: #1f1f1f;
  color: #e0e0e0;
}
` : ''}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

a {
  color: ${primaryColor};
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button, .btn {
  display: inline-block;
  background: ${primaryColor};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover, .btn:hover {
  background: ${primaryColor}dd;
}

.header {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: ${primaryColor};
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.mobile-menu-btn span {
  height: 3px;
  width: 100%;
  background-color: #333;
  border-radius: 10px;
}

.hero {
  padding: 6rem 0 4rem;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-content h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #111827;
}

${colors.dark ? `.dark-theme .hero-content h1 { color: #f3f4f6; }` : ''}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #4b5563;
}

${colors.dark ? `.dark-theme .hero-content p { color: #d1d5db; }` : ''}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.primary-btn {
  background-color: ${primaryColor};
}

.secondary-btn {
  background-color: transparent;
  color: ${primaryColor};
  border: 1px solid ${primaryColor};
}

.hero-image {
  width: 100%;
}

.placeholder-image {
  background-color: #e0e7ff;
  border-radius: 8px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${primaryColor};
  font-weight: bold;
}

.features {
  padding: 5rem 0;
  background-color: white;
}

${colors.dark ? `.dark-theme .features { background-color: #121212; }` : ''}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #111827;
}

${colors.dark ? `.dark-theme .section-title { color: #f3f4f6; }` : ''}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: #111827;
}

${colors.dark ? `.dark-theme .feature-card h3 { color: #f3f4f6; }` : ''}

.contact {
  padding: 5rem 0;
  background-color: #f3f4f6;
}

${colors.dark ? `.dark-theme .contact { background-color: #1f1f1f; }` : ''}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
  color: #333;
}

${colors.dark ? `
.dark-theme .form-group input,
.dark-theme .form-group textarea {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #e0e0e0;
}` : ''}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.footer {
  background-color: #111827;
  color: white;
  padding: 2rem 0;
  text-align: center;
}

${features.animation ? `
.animate-fade-in {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
` : ''}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
}`;

    const js = `// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
  }
  
  ${features.form ? `
  // Form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      alert('Thanks for your message, ' + name + '! We will get back to you soon.');
      contactForm.reset();
    });
  }` : ''}
  
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});`;

    return {
      code: {
        html,
        css,
        js
      },
      explanation: `A custom landing page with ${colors.dark ? 'dark theme' : 'light theme'} and ${features.animation ? 'animations' : 'no animations'}. Includes a responsive design, ${features.form ? 'contact form,' : ''} key features section, and smooth scrolling.`
    };
  };
  
  // Similarly define other template generators like generatePortfolioPage(), generateBlogPage(), etc.
  const generatePortfolioPage = (colors: any, features: any) => {
    // Similar implementation as generateLandingPage but for portfolio sites
    return {
      code: {
        html: "<h1>Portfolio Page</h1>",
        css: "/* Portfolio styles */",
        js: "// Portfolio JavaScript"
      },
      explanation: "A portfolio website template"
    };
  };
  
  const generateBlogPage = (colors: any, features: any) => {
    return {
      code: {
        html: "<h1>Blog Page</h1>",
        css: "/* Blog styles */",
        js: "// Blog JavaScript"
      },
      explanation: "A blog website template"
    };
  };
  
  const generateEcommercePage = (colors: any, features: any) => {
    return {
      code: {
        html: "<h1>E-commerce Page</h1>",
        css: "/* E-commerce styles */",
        js: "// E-commerce JavaScript"
      },
      explanation: "An e-commerce website template"
    };
  };
  
  const generateDashboardPage = (colors: any, features: any) => {
    return {
      code: {
        html: "<h1>Dashboard Page</h1>",
        css: "/* Dashboard styles */",
        js: "// Dashboard JavaScript"
      },
      explanation: "A dashboard application template"
    };
  };
  
  const generateSocialPage = (colors: any, features: any) => {
    return {
      code: {
        html: "<h1>Social Network Page</h1>",
        css: "/* Social Network styles */",
        js: "// Social Network JavaScript"
      },
      explanation: "A social network website template"
    };
  };
  
  const generateTodoPage = (colors: any, features: any) => {
    return {
      code: {
        html: "<h1>Todo App</h1>",
        css: "/* Todo App styles */",
        js: "// Todo App JavaScript"
      },
      explanation: "A todo application template"
    };
  };

  return {
    generateCode,
    isProcessing,
    saveApiKey,
    clearApiKey,
    apiKey,
    apiProvider,
    chatHistory
  };
}
