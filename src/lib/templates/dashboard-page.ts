
import { TemplateColors, TemplateFeatures } from "@/types/templates";
import { AIResponse } from "@/types";

export function generateDashboardPage(colors: TemplateColors, features: TemplateFeatures): AIResponse {
  const primaryColor = colors.blue ? "#3b82f6" : 
                      colors.green ? "#10b981" : 
                      colors.red ? "#ef4444" : 
                      colors.purple ? "#8b5cf6" : "#4f46e5";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics Dashboard</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="${colors.dark ? 'dark-theme' : ''}">
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="logo">Dashboard</h1>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li class="active"><a href="#"><span class="icon">📊</span> Overview</a></li>
          <li><a href="#"><span class="icon">📈</span> Analytics</a></li>
          <li><a href="#"><span class="icon">📅</span> Calendar</a></li>
          <li><a href="#"><span class="icon">💬</span> Messages</a></li>
          <li><a href="#"><span class="icon">⚙️</span> Settings</a></li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">JD</div>
          <span>John Doe</span>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <div class="search-box">
          <input type="text" placeholder="Search...">
          <button>🔍</button>
        </div>
        <div class="top-bar-actions">
          <button class="icon-button">🔔</button>
          <button class="icon-button">✉️</button>
        </div>
      </header>

      <div class="dashboard-container">
        <div class="dashboard-header">
          <h1>Dashboard Overview</h1>
          <div class="date-range">April 2025</div>
        </div>

        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-card-header">
              <h3>Total Users</h3>
              <span class="icon">👥</span>
            </div>
            <div class="stat-card-value">2,543</div>
            <div class="stat-card-change positive">+12% from last month</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <h3>Revenue</h3>
              <span class="icon">💰</span>
            </div>
            <div class="stat-card-value">$45,290</div>
            <div class="stat-card-change positive">+8% from last month</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <h3>Active Sessions</h3>
              <span class="icon">🔄</span>
            </div>
            <div class="stat-card-value">182</div>
            <div class="stat-card-change negative">-3% from last month</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <h3>Conversion Rate</h3>
              <span class="icon">🎯</span>
            </div>
            <div class="stat-card-value">3.6%</div>
            <div class="stat-card-change positive">+0.8% from last month</div>
          </div>
        </div>

        <div class="charts-section">
          <div class="chart-container">
            <h2>Weekly Revenue</h2>
            <div class="chart" id="revenueChart">
              <!-- Chart would be rendered here via JavaScript -->
              <div class="placeholder-chart">Revenue Chart Placeholder</div>
            </div>
          </div>
          
          <div class="chart-container">
            <h2>User Growth</h2>
            <div class="chart" id="userChart">
              <!-- Chart would be rendered here via JavaScript -->
              <div class="placeholder-chart">User Growth Chart Placeholder</div>
            </div>
          </div>
        </div>

        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon green">✓</div>
              <div class="activity-content">
                <div class="activity-title">New user registered</div>
                <div class="activity-time">2 minutes ago</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon blue">💲</div>
              <div class="activity-content">
                <div class="activity-title">New order #1234 received</div>
                <div class="activity-time">45 minutes ago</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon orange">⚠️</div>
              <div class="activity-content">
                <div class="activity-title">Server load at 82%</div>
                <div class="activity-time">1 hour ago</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon purple">📊</div>
              <div class="activity-content">
                <div class="activity-title">Monthly report generated</div>
                <div class="activity-time">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

  const css = `/* Dashboard styles */
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
  height: 100vh;
  overflow: hidden;
}

${colors.dark ? `
.dark-theme {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-theme .sidebar {
  background-color: #1a1a1a;
  border-right: 1px solid #333;
}

.dark-theme .top-bar {
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
}

.dark-theme .stat-card,
.dark-theme .chart-container,
.dark-theme .activity-list {
  background-color: #1a1a1a;
}

.dark-theme .search-box input {
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #444;
}
` : ''}

.dashboard-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.logo {
  font-size: 1.5rem;
  color: ${primaryColor};
}

.sidebar-nav {
  padding: 1.5rem 0;
  flex-grow: 1;
}

.sidebar-nav ul {
  list-style: none;
}

.sidebar-nav li {
  padding: 0.75rem 1.5rem;
  margin-bottom: 0.25rem;
}

.sidebar-nav li.active {
  background-color: ${primaryColor}20; /* 20% opacity */
  border-left: 3px solid ${primaryColor};
}

.sidebar-nav a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.sidebar-nav .icon {
  margin-right: 0.75rem;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eaeaea;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: ${primaryColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  margin-right: 0.75rem;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-box input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.search-box button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.top-bar-actions {
  display: flex;
  gap: 1rem;
}

.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.dashboard-container {
  padding: 1.5rem;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-card-header h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
}

.stat-card-value {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.stat-card-change {
  font-size: 0.875rem;
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-container h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.placeholder-chart {
  height: 200px;
  background-color: #f3f4f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.activity-list {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.recent-activity h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eaeaea;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.green {
  background-color: #d1fae5;
  color: #10b981;
}

.blue {
  background-color: #dbeafe;
  color: #3b82f6;
}

.orange {
  background-color: #ffedd5;
  color: #f97316;
}

.purple {
  background-color: #ede9fe;
  color: #8b5cf6;
}

.activity-title {
  font-weight: 500;
}

.activity-time {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}
`;

  const js = `// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
  // Toggle sidebar on mobile
  const sidebarToggle = document.createElement('button');
  sidebarToggle.className = 'sidebar-toggle icon-button';
  sidebarToggle.innerHTML = '≡';
  sidebarToggle.style.display = 'none';
  
  const topBar = document.querySelector('.top-bar');
  if (topBar) {
    topBar.prepend(sidebarToggle);
  }
  
  function handleResize() {
    const isMobile = window.innerWidth < 768;
    const sidebar = document.querySelector('.sidebar');
    
    if (isMobile) {
      sidebarToggle.style.display = 'block';
      sidebar.style.display = 'none';
    } else {
      sidebarToggle.style.display = 'none';
      sidebar.style.display = 'flex';
    }
  }
  
  window.addEventListener('resize', handleResize);
  handleResize();
  
  sidebarToggle.addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.style.display === 'none') {
      sidebar.style.display = 'flex';
    } else {
      sidebar.style.display = 'none';
    }
  });
  
  // Simulate charts with canvas (in a real app, you'd use a charting library like Chart.js)
  function drawSimpleChart(canvasId, type) {
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.width = 400;
    canvas.height = 200;
    
    const placeholder = document.getElementById(canvasId).querySelector('.placeholder-chart');
    if (placeholder) {
      placeholder.replaceWith(canvas);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '${primaryColor}';
        ctx.beginPath();
        
        if (type === 'line') {
          // Draw a simple line chart
          const points = [
            {x: 20, y: 150},
            {x: 80, y: 90},
            {x: 140, y: 120},
            {x: 200, y: 60},
            {x: 260, y: 80},
            {x: 320, y: 40},
            {x: 380, y: 70}
          ];
          
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
          
          // Add dots at each point
          points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '${primaryColor}';
            ctx.fill();
          });
        } else if (type === 'bar') {
          // Draw a simple bar chart
          const bars = [
            {x: 30, value: 100},
            {x: 90, value: 150},
            {x: 150, value: 80},
            {x: 210, value: 120},
            {x: 270, value: 130},
            {x: 330, value: 90}
          ];
          
          const baseY = 180;
          const barWidth = 40;
          
          bars.forEach(bar => {
            ctx.fillStyle = '${primaryColor}80'; // 50% opacity
            ctx.fillRect(bar.x, baseY - bar.value, barWidth, bar.value);
            
            ctx.strokeStyle = '${primaryColor}';
            ctx.strokeRect(bar.x, baseY - bar.value, barWidth, bar.value);
          });
        }
      }
    }
  }
  
  // Draw example charts with slight delay to ensure DOM is ready
  setTimeout(() => {
    drawSimpleChart('revenueChart', 'line');
    drawSimpleChart('userChart', 'bar');
  }, 300);
  
  ${features.animation ? `
  // Add animations for stats cards
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * (index + 1));
  });
  
  // Add animations for activity items
  const activityItems = document.querySelectorAll('.activity-item');
  activityItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 100 * (index + 1) + 500);
  });
  ` : ''}
});`;

  return {
    code: { html, css, js },
    explanation: "A responsive admin dashboard template with statistics, charts, and activity tracking."
  };
}
