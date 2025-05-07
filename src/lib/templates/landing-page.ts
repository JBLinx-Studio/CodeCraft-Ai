import { TemplateColors, TemplateFeatures } from "@/types/templates";

export function generateLandingPage(colors: TemplateColors, features: TemplateFeatures) {
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

  // Generate the CSS with enhanced styling
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
  background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px);
  background-size: 40px 40px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

${colors.dark ? `
.dark-theme {
  background-color: #121212;
  color: #e0e0e0;
  background-image: radial-gradient(#1e293b 1.5px, transparent 1.5px);
  background-size: 40px 40px;
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
  transition: all 0.2s ease;
}

a:hover {
  text-decoration: underline;
}

button, .btn {
  display: inline-block;
  background: ${primaryColor};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

button:hover, .btn:hover {
  background: ${primaryColor}dd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
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
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background-image: linear-gradient(135deg, #111827 0%, #333 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
}

${colors.dark ? `.dark-theme .hero-content h1 { 
  background-image: linear-gradient(135deg, #f3f4f6 0%, #ddd 100%);
  -webkit-background-clip: text;
  background-clip: text;
}` : ''}

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
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-radius: 12px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${primaryColor};
  font-weight: bold;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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
  position: relative;
  padding-bottom: 1rem;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: ${primaryColor};
  border-radius: 2px;
}

${colors.dark ? `.dark-theme .section-title { color: #f3f4f6; }` : ''}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  margin-bottom: 0.75rem;
  color: #111827;
  font-size: 1.5rem;
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
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

${colors.dark ? `.dark-theme .contact-form { background-color: #2d2d2d; }` : ''}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

${colors.dark ? `.dark-theme .form-group label { color: #e5e7eb; }` : ''}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
  color: #333;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: ${primaryColor};
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

${colors.dark ? `
.dark-theme .form-group input,
.dark-theme .form-group textarea {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #e0e0e0;
}

.dark-theme .form-group input:focus,
.dark-theme .form-group textarea:focus {
  border-color: ${primaryColor};
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}
` : ''}

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
  animation: fadeIn 1.2s ease-in-out;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  
  .hero-image {
    margin-top: 2rem;
  }
  
  .placeholder-image {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .feature-card {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .hero-content h1 {
    font-size: 2rem;
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
}`;

  return {
    code: {
      html,
      css,
      js
    },
    explanation: `A custom landing page with ${colors.dark ? 'dark theme' : 'light theme'} and ${features.animation ? 'animations' : 'no animations'}. Includes a responsive design, ${features.form ? 'contact form,' : ''} key features section, and smooth scrolling.`
  };
}
