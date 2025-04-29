
import { TemplateColors, TemplateFeatures } from "@/types/templates";
import { AIResponse } from "@/types";

export function generateEcommercePage(colors: TemplateColors, features: TemplateFeatures): AIResponse {
  const primaryColor = colors.blue ? "#3b82f6" : 
                      colors.green ? "#10b981" : 
                      colors.red ? "#ef4444" : 
                      colors.purple ? "#8b5cf6" : "#4f46e5";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-commerce Store</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="${colors.dark ? 'dark-theme' : ''}">
  <header>
    <div class="container">
      <div class="logo">WebStore</div>
      <nav>
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#categories">Categories</a></li>
          <li><a href="#deals">Deals</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <button class="icon-button">🔍</button>
        <button class="icon-button">👤</button>
        <button class="icon-button cart-button">🛒 <span class="cart-count">0</span></button>
      </div>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1>Summer Collection</h1>
        <p>Discover our newest products with special discounts</p>
        <button class="shop-now-btn">Shop Now</button>
      </div>
    </div>
  </section>

  <section id="products" class="products">
    <div class="container">
      <h2>Featured Products</h2>
      <div class="product-grid">
        <div class="product-card">
          <div class="product-image">Product 1</div>
          <h3>Stylish T-Shirt</h3>
          <div class="price">$29.99</div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
        <div class="product-card">
          <div class="product-image">Product 2</div>
          <h3>Designer Jeans</h3>
          <div class="price">$59.99</div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
        <div class="product-card">
          <div class="product-image">Product 3</div>
          <h3>Casual Sneakers</h3>
          <div class="price">$79.99</div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
        <div class="product-card">
          <div class="product-image">Product 4</div>
          <h3>Summer Hat</h3>
          <div class="price">$19.99</div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="container">
      <h2>Join Our Newsletter</h2>
      <p>Get the latest updates and exclusive offers</p>
      <form class="newsletter-form">
        <input type="email" placeholder="Your email address" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3>Shop</h3>
          <ul>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Sale</a></li>
            <li><a href="#">All Products</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Customer Care</h3>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>About Us</h3>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 WebStore. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;

  const css = `/* E-commerce styles */
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

.dark-theme .product-card {
  background-color: #1f1f1f;
  color: #e0e0e0;
}

.dark-theme .cta {
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
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.icon-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.cart-button {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  color: ${primaryColor};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero {
  background: url('https://via.placeholder.com/1200x400') center/cover;
  color: white;
  padding: 6rem 0;
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.shop-now-btn {
  background: white;
  color: ${primaryColor};
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shop-now-btn:hover {
  background: ${primaryColor};
  color: white;
}

.products {
  padding: 4rem 0;
}

.products h2 {
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-10px);
}

.product-image {
  height: 200px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.product-card h3 {
  padding: 1rem 1rem 0.5rem;
  font-size: 1.1rem;
}

.price {
  padding: 0 1rem;
  font-weight: bold;
  color: ${primaryColor};
  margin-bottom: 1rem;
}

.add-to-cart {
  background: ${primaryColor};
  color: white;
  border: none;
  width: 100%;
  padding: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-to-cart:hover {
  background: ${primaryColor}dd;
}

.cta {
  background: #f0f0f0;
  padding: 4rem 0;
  text-align: center;
}

.cta h2 {
  margin-bottom: 1rem;
}

.cta p {
  margin-bottom: 2rem;
}

.newsletter-form {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
}

.newsletter-form input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.newsletter-form button {
  padding: 0 1.5rem;
  background: ${primaryColor};
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

footer {
  background: #333;
  color: white;
  padding: 3rem 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-column h3 {
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}

.footer-column ul {
  list-style: none;
}

.footer-column li {
  margin-bottom: 0.8rem;
}

.footer-column a {
  color: #ccc;
  text-decoration: none;
}

.footer-column a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #444;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .hero h1 {
    font-size: 2.2rem;
  }
}
`;

  const js = `// E-commerce functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart
  let cartCount = 0;
  const cartCountElement = document.querySelector('.cart-count');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      cartCount++;
      cartCountElement.textContent = cartCount;
      
      // Show a quick animation on button click
      this.textContent = "Added!";
      this.style.background = "#4CAF50";
      
      setTimeout(() => {
        this.textContent = "Add to Cart";
        this.style.background = "${primaryColor}";
      }, 1000);
    });
  });
  
  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input').value;
      alert('Thanks for subscribing with ' + email + '!');
      this.reset();
    });
  }
  
  ${features.animation ? `
  // Add animations to product cards
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card, index) => {
    card.style.animationDelay = \`\${index * 0.1}s\`;
    card.classList.add('fade-in');
  });
  ` : ''}
});`;

  return {
    code: { html, css, js },
    explanation: "An e-commerce website template"
  };
}
