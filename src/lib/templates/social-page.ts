
import { TemplateColors, TemplateFeatures } from "@/types/templates";
import { AIResponse } from "@/types";

export function generateSocialPage(colors: TemplateColors, features: TemplateFeatures): AIResponse {
  const primaryColor = colors.blue ? "#3b82f6" : 
                      colors.green ? "#10b981" : 
                      colors.red ? "#ef4444" : 
                      colors.purple ? "#8b5cf6" : "#4f46e5";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Network</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="${colors.dark ? 'dark-theme' : ''}">
  <header class="header">
    <div class="container">
      <h1 class="logo">SocialApp</h1>
      
      <div class="search-bar">
        <input type="text" placeholder="Search...">
        <button>🔍</button>
      </div>
      
      <nav class="main-nav">
        <ul>
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">Notifications</a></li>
          <li><a href="#">Messages</a></li>
          <li><a href="#">Profile</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container main-container">
    <aside class="sidebar">
      <div class="profile-card">
        <div class="profile-header"></div>
        <div class="profile-content">
          <div class="profile-avatar">JD</div>
          <h2 class="profile-name">John Doe</h2>
          <p class="profile-username">@johndoe</p>
          <div class="profile-stats">
            <div class="stat">
              <div class="stat-value">248</div>
              <div class="stat-label">Following</div>
            </div>
            <div class="stat">
              <div class="stat-value">1.2k</div>
              <div class="stat-label">Followers</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="sidebar-section">
        <h3>Trending</h3>
        <ul class="trending-list">
          <li><a href="#">#WebDevelopment</a></li>
          <li><a href="#">#AItools</a></li>
          <li><a href="#">#TechNews</a></li>
          <li><a href="#">#Programming</a></li>
        </ul>
      </div>
      
      <div class="sidebar-section">
        <h3>Suggested Friends</h3>
        <div class="friend-suggestions">
          <div class="friend-item">
            <div class="friend-avatar">JS</div>
            <div class="friend-info">
              <div class="friend-name">Jane Smith</div>
              <button class="follow-button">Follow</button>
            </div>
          </div>
          <div class="friend-item">
            <div class="friend-avatar">MP</div>
            <div class="friend-info">
              <div class="friend-name">Mike Peterson</div>
              <button class="follow-button">Follow</button>
            </div>
          </div>
          <div class="friend-item">
            <div class="friend-avatar">AL</div>
            <div class="friend-info">
              <div class="friend-name">Amy Lee</div>
              <button class="follow-button">Follow</button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <section class="feed">
      <div class="post-composer">
        <div class="composer-avatar">JD</div>
        <div class="composer-input-container">
          <textarea placeholder="What's happening?"></textarea>
          <div class="composer-actions">
            <button class="action-button">📷</button>
            <button class="action-button">🔗</button>
            <button class="action-button">😊</button>
            <button class="post-button">Post</button>
          </div>
        </div>
      </div>

      <div class="posts">
        <div class="post">
          <div class="post-avatar">AL</div>
          <div class="post-content">
            <div class="post-header">
              <div class="post-author">Amy Lee</div>
              <div class="post-username">@amylee</div>
              <div class="post-time">2h ago</div>
            </div>
            <div class="post-text">
              Just finished building my first web app with WebCraft AI. It's amazing how quickly you can bring your ideas to life!
            </div>
            <div class="post-image">
              <div class="placeholder-image">Post Image</div>
            </div>
            <div class="post-actions">
              <button class="post-action">💬 24</button>
              <button class="post-action">🔄 12</button>
              <button class="post-action like-button">❤️ 87</button>
              <button class="post-action">📤</button>
            </div>
          </div>
        </div>

        <div class="post">
          <div class="post-avatar">MP</div>
          <div class="post-content">
            <div class="post-header">
              <div class="post-author">Mike Peterson</div>
              <div class="post-username">@mikepeterson</div>
              <div class="post-time">5h ago</div>
            </div>
            <div class="post-text">
              Learning about AI-powered development tools today. The potential is incredible! Have any of you tried WebCraft AI yet?
            </div>
            <div class="post-actions">
              <button class="post-action">💬 8</button>
              <button class="post-action">🔄 3</button>
              <button class="post-action like-button">❤️ 42</button>
              <button class="post-action">📤</button>
            </div>
          </div>
        </div>

        <div class="post">
          <div class="post-avatar">JS</div>
          <div class="post-content">
            <div class="post-header">
              <div class="post-author">Jane Smith</div>
              <div class="post-username">@janesmith</div>
              <div class="post-time">Yesterday</div>
            </div>
            <div class="post-text">
              Just released my new portfolio website! Check it out and let me know what you think.
            </div>
            <div class="post-image">
              <div class="placeholder-image">Portfolio Website Screenshot</div>
            </div>
            <div class="post-actions">
              <button class="post-action">💬 36</button>
              <button class="post-action">🔄 27</button>
              <button class="post-action like-button">❤️ 156</button>
              <button class="post-action">📤</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <aside class="right-sidebar">
      <div class="sidebar-section">
        <h3>Who to Follow</h3>
        <div class="who-to-follow">
          <div class="follow-item">
            <div class="follow-avatar">SJ</div>
            <div class="follow-info">
              <div class="follow-name">Sarah Johnson</div>
              <div class="follow-username">@sarahj</div>
            </div>
            <button class="follow-button">Follow</button>
          </div>
          <div class="follow-item">
            <div class="follow-avatar">RB</div>
            <div class="follow-info">
              <div class="follow-name">Robert Brown</div>
              <div class="follow-username">@robbrown</div>
            </div>
            <button class="follow-button">Follow</button>
          </div>
          <div class="follow-item">
            <div class="follow-avatar">EC</div>
            <div class="follow-info">
              <div class="follow-name">Emma Clark</div>
              <div class="follow-username">@emmaclark</div>
            </div>
            <button class="follow-button">Follow</button>
          </div>
          <a href="#" class="show-more">Show more</a>
        </div>
      </div>
      
      <div class="sidebar-section">
        <h3>Latest News</h3>
        <div class="news-list">
          <div class="news-item">
            <div class="news-topic">Technology</div>
            <div class="news-title">New AI features announced for WebCraft platform</div>
            <div class="news-time">2 hours ago</div>
          </div>
          <div class="news-item">
            <div class="news-topic">Web Development</div>
            <div class="news-title">The rise of no-code tools: What developers need to know</div>
            <div class="news-time">4 hours ago</div>
          </div>
          <div class="news-item">
            <div class="news-topic">Design</div>
            <div class="news-title">Design trends to watch in 2025</div>
            <div class="news-time">Yesterday</div>
          </div>
          <a href="#" class="show-more">Show more</a>
        </div>
      </div>
    </aside>
  </main>

  <script src="script.js"></script>
</body>
</html>`;

  const css = `/* Social Network styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #f0f2f5;
}

${colors.dark ? `
.dark-theme {
  background-color: #18191a;
  color: #e4e6eb;
}

.dark-theme .header,
.dark-theme .post-composer,
.dark-theme .post,
.dark-theme .profile-card,
.dark-theme .sidebar-section,
.dark-theme .follow-item,
.dark-theme .news-item {
  background-color: #242526;
  border-color: #393a3b;
}

.dark-theme .logo,
.dark-theme .main-nav a,
.dark-theme .post-author,
.dark-theme .profile-name {
  color: #e4e6eb;
}

.dark-theme .search-bar input {
  background-color: #3a3b3c;
  border-color: #3a3b3c;
  color: #e4e6eb;
}

.dark-theme .post-username,
.dark-theme .post-time,
.dark-theme .profile-username,
.dark-theme .follow-username,
.dark-theme .news-time {
  color: #b0b3b8;
}
` : ''}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}

/* Header */
.header {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: ${primaryColor};
}

.search-bar {
  flex-grow: 1;
  max-width: 400px;
  margin: 0 20px;
  display: flex;
}

.search-bar input {
  flex-grow: 1;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px 0 0 20px;
  font-size: 0.9rem;
}

.search-bar button {
  padding: 8px 15px;
  background: ${primaryColor};
  border: none;
  border-radius: 0 20px 20px 0;
  color: white;
}

.main-nav ul {
  display: flex;
}

.main-nav li {
  margin: 0 10px;
}

.main-nav a {
  color: #555;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.main-nav a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.main-nav li.active a {
  color: ${primaryColor};
  font-weight: 600;
}

/* Main layout */
.main-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  padding-top: 20px;
}

/* Sidebar */
.sidebar,
.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-header {
  height: 80px;
  background: linear-gradient(45deg, ${primaryColor}, ${primaryColor}aa);
}

.profile-content {
  padding: 0 15px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${primaryColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: -35px;
  border: 4px solid white;
}

.profile-name {
  margin-top: 10px;
  font-size: 1.2rem;
}

.profile-username {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.profile-stats {
  display: flex;
  width: 100%;
  justify-content: space-around;
  text-align: center;
  border-top: 1px solid #eee;
  margin-top: 15px;
  padding-top: 15px;
}

.stat-value {
  font-weight: bold;
  font-size: 1rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #777;
}

.sidebar-section {
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-section h3 {
  margin-bottom: 15px;
  font-size: 1rem;
}

.trending-list li {
  margin-bottom: 10px;
}

.trending-list a {
  color: ${primaryColor};
  font-weight: 500;
}

.friend-suggestions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.friend-item {
  display: flex;
  align-items: center;
}

.friend-avatar,
.follow-avatar,
.post-avatar,
.composer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${primaryColor}80;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.friend-info {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.follow-button {
  background-color: ${primaryColor};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.follow-button:hover {
  background-color: ${primaryColor}dd;
}

/* Feed */
.feed {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-composer {
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.composer-input-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.composer-input-container textarea {
  border: none;
  resize: none;
  min-height: 80px;
  font-family: inherit;
  font-size: 1rem;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.composer-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}

.action-button {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: ${primaryColor};
  padding: 5px;
}

.post-button {
  background-color: ${primaryColor};
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 500;
}

.post {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.post-content {
  flex-grow: 1;
}

.post-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.post-author {
  font-weight: 600;
  margin-right: 5px;
}

.post-username,
.post-time {
  color: #777;
  font-size: 0.9rem;
}

.post-username {
  margin-right: 10px;
}

.post-image {
  margin: 15px 0;
}

.placeholder-image {
  background-color: #f0f2f5;
  border-radius: 12px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-weight: 500;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.post-action {
  background: transparent;
  border: none;
  color: #777;
  padding: 8px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.post-action:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.like-button {
  color: #e0245e;
}

/* Right sidebar */
.who-to-follow {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.follow-item {
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.follow-item:last-child {
  border-bottom: none;
}

.follow-info {
  flex-grow: 1;
}

.follow-username {
  color: #777;
  font-size: 0.9rem;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.news-item {
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.news-item:last-child {
  border-bottom: none;
}

.news-topic {
  font-weight: 500;
  font-size: 0.8rem;
  color: ${primaryColor};
}

.news-title {
  font-size: 0.95rem;
  margin: 5px 0;
}

.news-time {
  font-size: 0.8rem;
  color: #777;
}

.show-more {
  color: ${primaryColor};
  font-size: 0.9rem;
  margin-top: 10px;
  display: block;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr 2fr;
  }
  
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
  
  .header .container {
    flex-wrap: wrap;
  }
  
  .search-bar {
    order: 3;
    width: 100%;
    max-width: none;
    margin: 10px 0 0;
  }
}

${features.animation ? `
/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.post {
  animation: fadeIn 0.3s ease;
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.like-button.liked {
  animation: likeAnimation 0.3s ease;
}
` : ''}
`;

  const js = `// Social network functionality
document.addEventListener('DOMContentLoaded', function() {
  // Post composer
  const postTextarea = document.querySelector('.composer-input-container textarea');
  const postButton = document.querySelector('.post-button');
  
  if (postTextarea && postButton) {
    // Disable post button if textarea is empty
    postButton.disabled = true;
    postButton.style.opacity = '0.5';
    
    postTextarea.addEventListener('input', function() {
      if (this.value.trim()) {
        postButton.disabled = false;
        postButton.style.opacity = '1';
      } else {
        postButton.disabled = true;
        postButton.style.opacity = '0.5';
      }
    });
    
    // Create a new post
    postButton.addEventListener('click', function() {
      const content = postTextarea.value.trim();
      if (content) {
        createNewPost(content);
        postTextarea.value = '';
        postButton.disabled = true;
        postButton.style.opacity = '0.5';
      }
    });
  }
  
  // Like functionality
  const likeButtons = document.querySelectorAll('.like-button');
  likeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentLikes = this.textContent.split(' ')[1];
      const isLiked = this.classList.contains('liked');
      
      if (isLiked) {
        this.textContent = '❤️ ' + (parseInt(currentLikes) - 1);
        this.classList.remove('liked');
      } else {
        this.textContent = '❤️ ' + (parseInt(currentLikes) + 1);
        this.classList.add('liked');
        ${features.animation ? `
        this.style.animation = 'none';
        this.offsetHeight; // Trigger reflow
        this.style.animation = 'likeAnimation 0.3s ease';
        ` : ''}
      }
    });
  });
  
  // Follow button functionality
  const followButtons = document.querySelectorAll('.follow-button');
  followButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.textContent === 'Follow') {
        this.textContent = 'Following';
        this.style.backgroundColor = '#1DA1F2';
      } else {
        this.textContent = 'Follow';
        this.style.backgroundColor = '${primaryColor}';
      }
    });
  });
  
  // Function to create a new post
  function createNewPost(content) {
    const posts = document.querySelector('.posts');
    const newPost = document.createElement('div');
    newPost.className = 'post';
    ${features.animation ? `
    newPost.style.opacity = '0';
    newPost.style.transform = 'translateY(20px)';
    ` : ''}
    
    newPost.innerHTML = \`
      <div class="post-avatar">JD</div>
      <div class="post-content">
        <div class="post-header">
          <div class="post-author">John Doe</div>
          <div class="post-username">@johndoe</div>
          <div class="post-time">Just now</div>
        </div>
        <div class="post-text">
          \${content}
        </div>
        <div class="post-actions">
          <button class="post-action">💬 0</button>
          <button class="post-action">🔄 0</button>
          <button class="post-action like-button">❤️ 0</button>
          <button class="post-action">📤</button>
        </div>
      </div>
    \`;
    
    if (posts.firstChild) {
      posts.insertBefore(newPost, posts.firstChild);
    } else {
      posts.appendChild(newPost);
    }
    
    ${features.animation ? `
    // Animate the new post
    setTimeout(() => {
      newPost.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      newPost.style.opacity = '1';
      newPost.style.transform = 'translateY(0)';
    }, 10);
    ` : ''}
    
    // Add like functionality to new post
    const newLikeButton = newPost.querySelector('.like-button');
    newLikeButton.addEventListener('click', function() {
      const currentLikes = this.textContent.split(' ')[1];
      const isLiked = this.classList.contains('liked');
      
      if (isLiked) {
        this.textContent = '❤️ ' + (parseInt(currentLikes) - 1);
        this.classList.remove('liked');
      } else {
        this.textContent = '❤️ ' + (parseInt(currentLikes) + 1);
        this.classList.add('liked');
        ${features.animation ? `
        this.style.animation = 'none';
        this.offsetHeight; // Trigger reflow
        this.style.animation = 'likeAnimation 0.3s ease';
        ` : ''}
      }
    });
  }
});`;

  return {
    code: { html, css, js },
    explanation: "A social network template with user profiles, post feeds, and social interaction features."
  };
}
