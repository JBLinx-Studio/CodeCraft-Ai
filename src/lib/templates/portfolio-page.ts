
import { TemplateColors, TemplateFeatures } from "@/types/templates";
import { AIResponse } from "@/types";

export function generatePortfolioPage(colors: TemplateColors, features: TemplateFeatures): AIResponse {
  // Simple implementation for portfolio pages
  const primaryColor = colors.blue ? "#3b82f6" : 
                        colors.green ? "#10b981" : 
                        colors.red ? "#ef4444" : 
                        colors.purple ? "#8b5cf6" : "#4f46e5";
                        
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="${colors.dark ? 'dark-theme' : ''}">
  <header>
    <div class="container">
      <h1 class="logo">My Portfolio</h1>
      <nav>
        <ul>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          ${features.form ? '<li><a href="#contact">Contact</a></li>' : ''}
        </ul>
      </nav>
    </div>
  </header>
  
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h2 class="${features.animation ? 'animate-fade-in' : ''}">Hi, I'm a Web Developer</h2>
        <p>I create beautiful and functional websites.</p>
      </div>
    </div>
  </section>
  
  <section id="projects" class="projects">
    <div class="container">
      <h2>My Projects</h2>
      <div class="project-grid">
        <div class="project-card">
          <div class="project-image">Project 1</div>
          <h3>Project One</h3>
          <p>A brief description of the project and technologies used.</p>
        </div>
        <div class="project-card">
          <div class="project-image">Project 2</div>
          <h3>Project Two</h3>
          <p>A brief description of the project and technologies used.</p>
        </div>
        <div class="project-card">
          <div class="project-image">Project 3</div>
          <h3>Project Three</h3>
          <p>A brief description of the project and technologies used.</p>
        </div>
      </div>
    </div>
  </section>
  
  <footer>
    <div class="container">
      <p>&copy; 2025 My Portfolio. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

  const css = `/* Basic styles for the portfolio */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9fafb;
  transition: all 0.3s ease;
}

${colors.dark ? `
.dark-theme {
  background-color: #121212;
  color: #e0e0e0;
}
` : ''}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

header {
  background-color: ${primaryColor};
  color: white;
  padding: 1rem 0;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.hero {
  padding: 6rem 0;
  text-align: center;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-10px);
}

.project-image {
  height: 200px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.project-card h3, .project-card p {
  padding: 1rem;
}

footer {
  background: #333;
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
` : ''}
`;

  const js = `// Basic portfolio interactions
document.addEventListener('DOMContentLoaded', function() {
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
    code: { html, css, js },
    explanation: "A clean portfolio template showcasing projects with a focus on a professional presentation."
  };
}
