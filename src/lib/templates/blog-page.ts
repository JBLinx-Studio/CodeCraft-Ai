
import { TemplateColors, TemplateFeatures } from "@/types/templates";
import { AIResponse } from "@/types";

export function generateBlogPage(colors: TemplateColors, features: TemplateFeatures): AIResponse {
  const primaryColor = colors.blue ? "#3b82f6" : 
                      colors.green ? "#10b981" : 
                      colors.red ? "#ef4444" : 
                      colors.purple ? "#8b5cf6" : "#4f46e5";
                      
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Blog</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="${colors.dark ? 'dark-theme' : ''}">
  <header>
    <div class="container">
      <h1 class="site-title">My Blog</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#articles">Articles</a></li>
          <li><a href="#about">About</a></li>
          ${features.form ? '<li><a href="#contact">Contact</a></li>' : ''}
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="featured-post">
      <h2>Featured Article</h2>
      <article class="post">
        <div class="post-image">Featured Image</div>
        <h3>How to Build a Blog with WebCraft AI</h3>
        <div class="post-meta">
          <span>April 29, 2025</span>
          <span>5 min read</span>
        </div>
        <p>
          In this comprehensive guide, I'll show you how to leverage WebCraft AI
          to build a beautiful and functional blog without writing a single line of code...
        </p>
        <a href="#" class="read-more">Read more</a>
      </article>
    </section>

    <section class="recent-posts">
      <h2>Recent Articles</h2>
      <div class="post-grid">
        <article class="post-card">
          <div class="post-image">Post Image</div>
          <h3>Getting Started with AI Tools</h3>
          <div class="post-meta">
            <span>April 24, 2025</span>
            <span>3 min read</span>
          </div>
          <p>An introduction to the world of AI-powered development tools...</p>
          <a href="#" class="read-more">Read more</a>
        </article>
        
        <article class="post-card">
          <div class="post-image">Post Image</div>
          <h3>The Future of Web Development</h3>
          <div class="post-meta">
            <span>April 20, 2025</span>
            <span>4 min read</span>
          </div>
          <p>Exploring how AI and automation are changing the landscape...</p>
          <a href="#" class="read-more">Read more</a>
        </article>
        
        <article class="post-card">
          <div class="post-image">Post Image</div>
          <h3>Design Principles for Modern Web</h3>
          <div class="post-meta">
            <span>April 15, 2025</span>
            <span>6 min read</span>
          </div>
          <p>Key design principles that make your websites stand out...</p>
          <a href="#" class="read-more">Read more</a>
        </article>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2025 My Blog. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

  const css = `/* Blog styles */
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
}

${colors.dark ? `
.dark-theme {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-theme .post-card, .dark-theme .post {
  background-color: #1f1f1f;
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
  margin-bottom: 2rem;
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

h2 {
  margin-bottom: 1.5rem;
  color: ${primaryColor};
}

.post {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.post-image {
  height: 250px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.post h3, .post p, .post-meta, .read-more {
  padding: 0 1.5rem;
}

.post h3 {
  margin-top: 1.5rem;
}

.post-meta {
  color: #666;
  margin: 0.5rem 0 1rem;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
}

.read-more {
  display: inline-block;
  color: ${primaryColor};
  text-decoration: none;
  font-weight: 500;
  margin: 1rem 0 1.5rem 1.5rem;
}

.recent-posts {
  margin-top: 3rem;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-card .post-image {
  height: 180px;
}

.post-card h3 {
  padding: 1rem 1rem 0.5rem;
}

.post-card .post-meta {
  padding: 0 1rem;
  margin-bottom: 0.5rem;
}

.post-card p {
  padding: 0 1rem;
}

.post-card .read-more {
  margin: 1rem 0 1.5rem 1rem;
}

footer {
  background: #333;
  color: white;
  padding: 2rem 0;
  text-align: center;
  margin-top: 4rem;
}
`;

  const js = `// Blog interactions
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      if (target !== "#") {
        document.querySelector(target).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  ${features.animation ? `
  // Add fade-in animations to posts as they scroll into view
  const posts = document.querySelectorAll('.post-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });
  
  posts.forEach(post => {
    observer.observe(post);
  });
  ` : ''}
});`;

  return {
    code: { html, css, js },
    explanation: "A clean and modern blog template with featured and recent articles sections."
  };
}
