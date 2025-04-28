
import { useState } from "react";
import { AIResponse } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Define a constant for the demo mode
const USE_DEMO_MODE = true; // Set to false when you have a valid API key

// For a real implementation, you would use an environment variable or secure storage
// This is just a demo implementation
const API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
// In a production app, you would need to provide your own API key
const API_KEY = ""; // Intentionally left blank for demo

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateCode = async (prompt: string): Promise<AIResponse> => {
    setIsProcessing(true);
    
    try {
      // If in demo mode or API key is missing, use the fallback generator
      if (USE_DEMO_MODE || !API_KEY) {
        // Add a slight delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        return generateFallbackCode(prompt);
      }
      
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

      // Using the Hugging Face Inference API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ inputs: enhancedPrompt }),
      });

      if (!response.ok) {
        console.error("API response error:", response.statusText);
        toast({
          title: "API Error",
          description: "Could not connect to the AI service. Using fallback mode.",
          variant: "destructive",
        });
        return generateFallbackCode(prompt);
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
        toast({
          title: "Parsing Error",
          description: "Failed to parse the AI response. Using fallback mode.",
          variant: "destructive",
        });
        return generateFallbackCode(prompt);
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
      toast({
        title: "Error",
        description: "An unexpected error occurred. Using fallback mode.",
        variant: "destructive",
      });
      return generateFallbackCode(prompt);
    } finally {
      setIsProcessing(false);
    }
  };

  // Improved fallback code generator with more templates
  const generateFallbackCode = (prompt: string): AIResponse => {
    // Analyze prompt to determine what kind of website to generate
    const promptLower = prompt.toLowerCase();
    const isLandingPage = promptLower.includes("landing") || promptLower.includes("home");
    const isPortfolio = promptLower.includes("portfolio") || promptLower.includes("showcase");
    const isBlog = promptLower.includes("blog") || promptLower.includes("article");
    const isEcommerce = promptLower.includes("shop") || promptLower.includes("store") || promptLower.includes("ecommerce");
    const isDashboard = promptLower.includes("dashboard") || promptLower.includes("admin") || promptLower.includes("analytics");
    
    let html = '';
    let css = '';
    let js = '';
    let explanation = '';
    
    // Default styles for all templates
    const commonCSS = `
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
      }
      
      .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      a {
        color: #4f46e5;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      button, .btn {
        display: inline-block;
        background: #4f46e5;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      button:hover, .btn:hover {
        background: #4338ca;
      }
    `;
    
    if (isLandingPage) {
      html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Platform</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <div class="logo">WebCraft</div>
        <ul class="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button class="mobile-menu-btn" id="menuToggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1>Build Amazing Web Applications</h1>
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
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>Fast Development</h3>
          <p>Build web applications in minutes instead of weeks.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Beautiful Design</h3>
          <p>Professional designs that look great on any device.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💡</div>
          <h3>Smart AI</h3>
          <p>AI-powered tools that understand your requirements.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔄</div>
          <h3>Real-time Preview</h3>
          <p>See changes instantly as you make them.</p>
        </div>
      </div>
    </div>
  </section>

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

  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 WebCraft. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

      css = `${commonCSS}
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
  color: #4f46e5;
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

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #4b5563;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.primary-btn {
  background-color: #4f46e5;
}

.secondary-btn {
  background-color: transparent;
  color: #4f46e5;
  border: 1px solid #4f46e5;
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
  color: #4f46e5;
  font-weight: bold;
}

.features {
  padding: 5rem 0;
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #111827;
}

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

.contact {
  padding: 5rem 0;
  background-color: #f3f4f6;
}

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
}

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

      js = `// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
  }
  
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
  }
  
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

      explanation = "A responsive landing page with a hero section, features grid, contact form, and mobile-friendly navigation. Includes smooth scrolling and form validation.";
    } else if (isPortfolio) {
      // Portfolio template code
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creative Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <div class="logo">John Doe</div>
        <ul class="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1>Hi, I'm <span class="highlight">John Doe</span></h1>
        <h2>Frontend Developer & UI Designer</h2>
        <p>I create beautiful and functional web experiences</p>
        <div class="hero-buttons">
          <a href="#projects" class="btn primary-btn">View My Work</a>
          <a href="#contact" class="btn secondary-btn">Contact Me</a>
        </div>
      </div>
    </div>
  </section>

  <section id="about" class="about">
    <div class="container">
      <h2 class="section-title">About Me</h2>
      <div class="about-content">
        <div class="about-image">
          <div class="placeholder-avatar">JD</div>
        </div>
        <div class="about-text">
          <p>I'm a passionate frontend developer with 5 years of experience creating modern and responsive websites. My focus is on writing clean, efficient code and crafting intuitive user interfaces.</p>
          <p>When I'm not coding, you can find me hiking, reading, or experimenting with new technologies.</p>
          <div class="about-details">
            <div class="detail-item">
              <h4>Name:</h4>
              <p>John Doe</p>
            </div>
            <div class="detail-item">
              <h4>Email:</h4>
              <p>john@example.com</p>
            </div>
            <div class="detail-item">
              <h4>Location:</h4>
              <p>San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="projects" class="projects">
    <div class="container">
      <h2 class="section-title">My Projects</h2>
      <div class="projects-grid">
        <div class="project-card">
          <div class="project-image"></div>
          <div class="project-content">
            <h3>E-commerce Website</h3>
            <p>A fully responsive e-commerce platform with cart functionality and payment integration.</p>
            <div class="project-tags">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn small-btn">Demo</a>
              <a href="#" class="btn small-btn secondary-btn">Code</a>
            </div>
          </div>
        </div>
        <div class="project-card">
          <div class="project-image"></div>
          <div class="project-content">
            <h3>Task Management App</h3>
            <p>A drag-and-drop task manager with user authentication and real-time updates.</p>
            <div class="project-tags">
              <span>Vue.js</span>
              <span>Firebase</span>
              <span>Tailwind CSS</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn small-btn">Demo</a>
              <a href="#" class="btn small-btn secondary-btn">Code</a>
            </div>
          </div>
        </div>
        <div class="project-card">
          <div class="project-image"></div>
          <div class="project-content">
            <h3>Weather Dashboard</h3>
            <p>A weather application with location detection and 5-day forecast.</p>
            <div class="project-tags">
              <span>JavaScript</span>
              <span>API</span>
              <span>CSS3</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn small-btn">Demo</a>
              <a href="#" class="btn small-btn secondary-btn">Code</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 John Doe. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

      css = `${commonCSS}
.header {
  position: fixed;
  width: 100%;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
  color: #4f46e5;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.hero {
  padding: 12rem 0 6rem;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  text-align: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.highlight {
  color: #c7d2fe;
}

.hero-content h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 400;
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-btn {
  background-color: white;
  color: #4f46e5;
}

.secondary-btn {
  background-color: transparent;
  color: white;
  border: 1px solid white;
}

.about {
  padding: 6rem 0;
  background-color: #f9fafb;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #111827;
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: #4f46e5;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: center;
}

.placeholder-avatar {
  background-color: #c7d2fe;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #4f46e5;
  font-weight: bold;
  margin: 0 auto;
}

.about-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #4b5563;
}

.about-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

.detail-item h4 {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.projects {
  padding: 6rem 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-image {
  height: 200px;
  background-color: #e0e7ff;
}

.project-content {
  padding: 1.5rem;
  background-color: white;
}

.project-content h3 {
  margin-bottom: 0.75rem;
  color: #111827;
}

.project-content p {
  color: #4b5563;
  margin-bottom: 1rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.project-tags span {
  background-color: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  color: #4b5563;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.small-btn {
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;
}

.footer {
  background-color: #1f2937;
  color: white;
  padding: 2rem 0;
  text-align: center;
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .about-details {
    grid-template-columns: 1fr;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .nav-links {
    display: none;
  }
}`;

      js = `// Smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  for (const link of links) {
    link.addEventListener('click', clickHandler);
  }
  
  function clickHandler(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop - 70;
    
    scroll({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
  
  // Add active class to nav items on scroll
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
});`;

      explanation = "A personal portfolio website with sections for about, projects, skills, and contact. Features a responsive design, smooth scrolling, and active navigation highlighting.";
    } else {
      // Default simple website
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Application</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      <h1>My Web Application</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <main>
    <section id="home" class="hero">
      <div class="container">
        <h2>Welcome to My Web App</h2>
        <p>This is a simple web application created with WebCraft AI.</p>
        <button id="actionButton">Get Started</button>
      </div>
    </section>
    
    <section id="about" class="about">
      <div class="container">
        <h2>About</h2>
        <p>This web application was generated based on your prompt. You can customize it further to meet your specific needs.</p>
      </div>
    </section>
    
    <section id="contact" class="contact">
      <div class="container">
        <h2>Contact</h2>
        <form id="contactForm">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
          </div>
          <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" name="message"></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  </main>
  
  <footer>
    <div class="container">
      <p>&copy; 2025 My Web Application. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

      css = `${commonCSS}
header {
  background-color: #4f46e5;
  color: white;
  padding: 1rem 0;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

nav a {
  color: white;
  text-decoration: none;
}

.hero {
  background-color: #f3f4f6;
  padding: 4rem 0;
  text-align: center;
}

.hero h2 {
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.hero p {
  margin-bottom: 2rem;
  font-size: 1.25rem;
  color: #4b5563;
}

.about, .contact {
  padding: 4rem 0;
}

.about {
  background-color: white;
}

.contact {
  background-color: #f9fafb;
}

h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #111827;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

footer {
  background-color: #1f2937;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
}

@media (max-width: 768px) {
  header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero h2 {
    font-size: 2rem;
  }
}`;

      js = `// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Handle action button click
  const actionButton = document.getElementById('actionButton');
  if (actionButton) {
    actionButton.addEventListener('click', function() {
      alert('Button clicked! Add your functionality here.');
    });
  }
  
  // Handle contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      console.log('Form submitted with:', { name, email, message });
      alert('Message sent! (This is just a demo)');
      contactForm.reset();
    });
  }
  
  // Add smooth scrolling to nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});`;

      explanation = "A simple responsive website with navigation, hero section, about section, contact form, and footer. Includes basic interactivity like form submission and smooth scrolling.";
    }
    
    return {
      code: { html, css, js },
      explanation
    };
  };

  return {
    generateCode,
    isProcessing
  };
}
