
import { TemplateColors, TemplateFeatures } from "@/types/templates";
import { AIResponse } from "@/types";

export function generateTodoPage(colors: TemplateColors, features: TemplateFeatures): AIResponse {
  const primaryColor = colors.blue ? "#3b82f6" : 
                      colors.green ? "#10b981" : 
                      colors.red ? "#ef4444" : 
                      colors.purple ? "#8b5cf6" : "#4f46e5";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="${colors.dark ? 'dark-theme' : ''}">
  <div class="container">
    <header>
      <h1>My Todo List</h1>
      <p class="date" id="currentDate"></p>
    </header>
    
    <div class="app-container">
      <div class="sidebar">
        <div class="filters">
          <h2>Filters</h2>
          <ul>
            <li class="active" data-filter="all">All Tasks</li>
            <li data-filter="today">Today</li>
            <li data-filter="upcoming">Upcoming</li>
            <li data-filter="completed">Completed</li>
          </ul>
        </div>
        
        <div class="categories">
          <h2>Categories</h2>
          <ul>
            <li data-category="personal" class="category-personal">Personal</li>
            <li data-category="work" class="category-work">Work</li>
            <li data-category="shopping" class="category-shopping">Shopping</li>
            <li data-category="other" class="category-other">Other</li>
          </ul>
          <button class="add-category-btn">+ Add Category</button>
        </div>
      </div>
      
      <div class="main-content">
        <div class="task-form">
          <input type="text" id="taskInput" placeholder="Add a new task...">
          <div class="task-form-actions">
            <div class="task-form-options">
              <div class="dropdown">
                <button class="dropdown-toggle">
                  <span class="current-category category-personal">Personal</span>
                  <span class="icon">▾</span>
                </button>
                <div class="dropdown-menu">
                  <div class="dropdown-item category-personal" data-value="personal">Personal</div>
                  <div class="dropdown-item category-work" data-value="work">Work</div>
                  <div class="dropdown-item category-shopping" data-value="shopping">Shopping</div>
                  <div class="dropdown-item category-other" data-value="other">Other</div>
                </div>
              </div>
              <div class="dropdown">
                <button class="dropdown-toggle">
                  <span class="current-date">Today</span>
                  <span class="icon">▾</span>
                </button>
                <div class="dropdown-menu">
                  <div class="dropdown-item" data-value="today">Today</div>
                  <div class="dropdown-item" data-value="tomorrow">Tomorrow</div>
                  <div class="dropdown-item" data-value="next-week">Next Week</div>
                  <div class="dropdown-item date-picker" data-value="custom">
                    <input type="date" id="customDate">
                  </div>
                </div>
              </div>
            </div>
            <button id="addTaskBtn" class="add-task-btn">Add Task</button>
          </div>
        </div>
        
        <div class="tasks-container">
          <h2 class="tasks-header">All Tasks <span class="task-count">3</span></h2>
          
          <div class="task-list">
            <div class="task-item" data-id="1" data-completed="false" data-category="work" data-date="2025-04-29">
              <div class="task-checkbox"></div>
              <div class="task-content">
                <h3>Complete project proposal</h3>
                <div class="task-meta">
                  <span class="task-category category-work">Work</span>
                  <span class="task-date">Today</span>
                </div>
              </div>
              <div class="task-actions">
                <button class="task-edit">✏️</button>
                <button class="task-delete">🗑️</button>
              </div>
            </div>
            
            <div class="task-item" data-id="2" data-completed="false" data-category="personal" data-date="2025-04-30">
              <div class="task-checkbox"></div>
              <div class="task-content">
                <h3>Go to the gym</h3>
                <div class="task-meta">
                  <span class="task-category category-personal">Personal</span>
                  <span class="task-date">Tomorrow</span>
                </div>
              </div>
              <div class="task-actions">
                <button class="task-edit">✏️</button>
                <button class="task-delete">🗑️</button>
              </div>
            </div>
            
            <div class="task-item completed" data-id="3" data-completed="true" data-category="shopping" data-date="2025-04-29">
              <div class="task-checkbox checked"></div>
              <div class="task-content">
                <h3>Buy groceries</h3>
                <div class="task-meta">
                  <span class="task-category category-shopping">Shopping</span>
                  <span class="task-date">Today</span>
                </div>
              </div>
              <div class="task-actions">
                <button class="task-edit">✏️</button>
                <button class="task-delete">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="modal" id="editTaskModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Task</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="editTaskTitle">Task Title</label>
          <input type="text" id="editTaskTitle">
        </div>
        <div class="form-group">
          <label for="editTaskCategory">Category</label>
          <select id="editTaskCategory">
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="editTaskDate">Due Date</label>
          <input type="date" id="editTaskDate">
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" id="editTaskCompleted">
            <span class="checkbox-custom"></span>
            Mark as completed
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn">Cancel</button>
        <button class="save-btn">Save Changes</button>
      </div>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>`;

  const css = `/* Todo App styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #f5f7fb;
  min-height: 100vh;
}

${colors.dark ? `
.dark-theme {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-theme .app-container,
.dark-theme .sidebar,
.dark-theme .main-content,
.dark-theme .task-form,
.dark-theme .task-item,
.dark-theme .dropdown-menu,
.dark-theme .modal-content {
  background-color: #1e1e1e;
  border-color: #333;
}

.dark-theme input[type="text"],
.dark-theme input[type="date"],
.dark-theme select {
  background-color: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

.dark-theme .task-form-options .dropdown-toggle {
  background-color: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

.dark-theme .sidebar li:hover:not(.active) {
  background-color: #2d2d2d;
}

.dark-theme .task-checkbox {
  border-color: #555;
}
` : ''}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  color: ${primaryColor};
  margin-bottom: 0.5rem;
}

.date {
  color: #777;
}

.app-container {
  display: flex;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #f9fafc;
  border-right: 1px solid #eee;
  padding: 1.5rem;
}

.sidebar h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #555;
}

.sidebar ul {
  list-style: none;
}

.sidebar li {
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sidebar li:hover:not(.active) {
  background-color: #f0f0f0;
}

.sidebar li.active {
  background-color: ${primaryColor};
  color: white;
}

.categories {
  margin-top: 2rem;
}

.category-personal {
  color: #3b82f6;
}

.category-work {
  color: #ef4444;
}

.category-shopping {
  color: #10b981;
}

.category-other {
  color: #8b5cf6;
}

.add-category-btn {
  background: none;
  border: none;
  color: ${primaryColor};
  padding: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  width: 100%;
  text-align: left;
  margin-top: 10px;
}

/* Main content */
.main-content {
  flex-grow: 1;
  padding: 1.5rem;
}

.task-form {
  background-color: #f9fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.task-form input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.task-form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-form-options {
  display: flex;
  gap: 10px;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  background: white;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 150px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: none;
}

.dropdown.open .dropdown-menu {
  display: block;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.date-picker {
  padding: 8px 12px;
}

.date-picker input {
  margin: 0;
  padding: 5px;
}

.add-task-btn {
  background-color: ${primaryColor};
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.add-task-btn:hover {
  background-color: ${primaryColor}dd;
}

/* Task list */
.tasks-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.task-count {
  margin-left: 10px;
  background-color: ${primaryColor};
  color: white;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 10px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border: 1px solid #eee;
}

.task-item:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.task-checkbox {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #ddd;
  margin-right: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-checkbox.checked {
  background-color: ${primaryColor};
  border-color: ${primaryColor};
  position: relative;
}

.task-checkbox.checked::after {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 8px;
  height: 5px;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(-45deg);
}

.task-content {
  flex-grow: 1;
}

.task-item.completed h3 {
  text-decoration: line-through;
  color: #999;
}

.task-meta {
  display: flex;
  gap: 10px;
  margin-top: 5px;
  font-size: 0.85rem;
}

.task-category {
  font-weight: 500;
}

.task-date {
  color: #777;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.task-edit,
.task-delete {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.task-edit:hover,
.task-delete:hover {
  opacity: 1;
}

/* Modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  justify-content: center;
  align-items: center;
}

.modal.show {
  display: flex;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #ddd;
  margin-right: 10px;
  position: relative;
}

.checkbox-label input:checked + .checkbox-custom {
  background-color: ${primaryColor};
  border-color: ${primaryColor};
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 5px;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(-45deg);
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background: #f2f2f2;
  border: 1px solid #ddd;
}

.save-btn {
  background-color: ${primaryColor};
  color: white;
  border: none;
}

/* Responsive */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
  }
  
  .task-form-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .task-form-options {
    justify-content: space-between;
  }
  
  .dropdown {
    flex: 1;
  }
  
  .dropdown-toggle {
    width: 100%;
  }
}

${features.animation ? `
/* Animations */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.task-item {
  animation: slideIn 0.2s ease;
}

@keyframes checkboxCheck {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.task-checkbox.checked {
  animation: checkboxCheck 0.3s ease;
}
` : ''}
`;

  const js = `// Todo app functionality
document.addEventListener('DOMContentLoaded', function() {
  // Display current date
  const dateElem = document.getElementById('currentDate');
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElem.textContent = today.toLocaleDateString('en-US', options);

  // Initialize tasks
  let tasks = [
    {
      id: 1,
      title: 'Complete project proposal',
      category: 'work',
      date: '2025-04-29',
      completed: false
    },
    {
      id: 2,
      title: 'Go to the gym',
      category: 'personal',
      date: '2025-04-30',
      completed: false
    },
    {
      id: 3,
      title: 'Buy groceries',
      category: 'shopping',
      date: '2025-04-29',
      completed: true
    }
  ];
  
  // Task form functionality
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  
  // Category dropdown
  const categoryDropdown = document.querySelector('.task-form-options .dropdown:first-child');
  const categoryToggle = categoryDropdown.querySelector('.dropdown-toggle');
  const categoryItems = categoryDropdown.querySelectorAll('.dropdown-item');
  
  // Date dropdown
  const dateDropdown = document.querySelector('.task-form-options .dropdown:last-child');
  const dateToggle = dateDropdown.querySelector('.dropdown-toggle');
  const dateItems = dateDropdown.querySelectorAll('.dropdown-item');
  const customDateInput = document.getElementById('customDate');
  
  // Initialize with defaults
  let selectedCategory = 'personal';
  let selectedDate = formatDate(today);
  
  // Handle dropdown toggling
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const dropdown = this.parentElement;
      dropdown.classList.toggle('open');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }
  });
  
  // Category selection
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      selectedCategory = this.dataset.value;
      const categoryText = this.textContent;
      const categoryClass = this.className.split(' ').find(c => c.startsWith('category-'));
      
      categoryToggle.querySelector('.current-category').textContent = categoryText;
      categoryToggle.querySelector('.current-category').className = 'current-category ' + categoryClass;
      
      categoryDropdown.classList.remove('open');
    });
  });
  
  // Date selection
  dateItems.forEach(item => {
    item.addEventListener('click', function() {
      const value = this.dataset.value;
      
      if (value === 'custom') {
        return; // Let the date picker handle this
      }
      
      let date = new Date();
      if (value === 'tomorrow') {
        date.setDate(date.getDate() + 1);
      } else if (value === 'next-week') {
        date.setDate(date.getDate() + 7);
      }
      
      selectedDate = formatDate(date);
      dateToggle.querySelector('.current-date').textContent = value === 'today' ? 'Today' : 
                                                             value === 'tomorrow' ? 'Tomorrow' : 'Next Week';
      
      dateDropdown.classList.remove('open');
    });
  });
  
  // Custom date picker
  customDateInput.addEventListener('change', function() {
    selectedDate = this.value;
    dateToggle.querySelector('.current-date').textContent = formatDisplayDate(new Date(selectedDate));
    setTimeout(() => {
      dateDropdown.classList.remove('open');
    }, 200);
  });
  
  // Add new task
  addTaskBtn.addEventListener('click', function() {
    const taskTitle = taskInput.value.trim();
    
    if (taskTitle) {
      const newTask = {
        id: Date.now(), // Simple id generator
        title: taskTitle,
        category: selectedCategory,
        date: selectedDate,
        completed: false
      };
      
      tasks.push(newTask);
      renderTasks();
      taskInput.value = '';
      
      // Reset to defaults
      selectedCategory = 'personal';
      selectedDate = formatDate(today);
      
      // Update UI
      categoryToggle.querySelector('.current-category').textContent = 'Personal';
      categoryToggle.querySelector('.current-category').className = 'current-category category-personal';
      dateToggle.querySelector('.current-date').textContent = 'Today';
    }
  });
  
  // Filter tasks
  const filterItems = document.querySelectorAll('.filters li');
  let currentFilter = 'all';
  
  filterItems.forEach(item => {
    item.addEventListener('click', function() {
      currentFilter = this.dataset.filter;
      
      // Update active state
      filterItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      renderTasks();
    });
  });
  
  // Category filter
  const categoryItems = document.querySelectorAll('.categories li');
  let currentCategory = null;
  
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      if (currentCategory === this.dataset.category) {
        // Deselect if already selected
        currentCategory = null;
        this.classList.remove('active');
      } else {
        currentCategory = this.dataset.category;
        
        // Update active state
        categoryItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      }
      
      renderTasks();
    });
  });
  
  // Task item interactions
  const taskList = document.querySelector('.task-list');
  
  taskList.addEventListener('click', function(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    const task = tasks.find(t => t.id === taskId);
    
    // Handle checkbox click
    if (e.target.classList.contains('task-checkbox')) {
      task.completed = !task.completed;
      
      if (task.completed) {
        e.target.classList.add('checked');
        taskItem.classList.add('completed');
      } else {
        e.target.classList.remove('checked');
        taskItem.classList.remove('completed');
      }
    }
    
    // Handle edit button
    if (e.target.classList.contains('task-edit')) {
      openEditModal(task);
    }
    
    // Handle delete button
    if (e.target.classList.contains('task-delete')) {
      tasks = tasks.filter(t => t.id !== taskId);
      renderTasks();
    }
  });
  
  // Edit task modal
  const modal = document.getElementById('editTaskModal');
  const closeModalBtn = modal.querySelector('.close-modal');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const saveBtn = modal.querySelector('.save-btn');
  
  let currentEditingTaskId = null;
  
  function openEditModal(task) {
    currentEditingTaskId = task.id;
    
    // Populate form
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskCategory').value = task.category;
    document.getElementById('editTaskDate').value = task.date;
    document.getElementById('editTaskCompleted').checked = task.completed;
    
    // Show modal
    modal.classList.add('show');
  }
  
  function closeModal() {
    modal.classList.remove('show');
    currentEditingTaskId = null;
  }
  
  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  saveBtn.addEventListener('click', function() {
    const task = tasks.find(t => t.id === currentEditingTaskId);
    
    if (task) {
      task.title = document.getElementById('editTaskTitle').value;
      task.category = document.getElementById('editTaskCategory').value;
      task.date = document.getElementById('editTaskDate').value;
      task.completed = document.getElementById('editTaskCompleted').checked;
      
      renderTasks();
      closeModal();
    }
  });
  
  // Helper functions
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  
  function formatDisplayDate(date) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
  
  function renderTasks() {
    let filteredTasks = [...tasks];
    
    // Apply current filter
    if (currentFilter === 'today') {
      const todayStr = formatDate(new Date());
      filteredTasks = filteredTasks.filter(t => t.date === todayStr);
    } else if (currentFilter === 'upcoming') {
      const todayStr = formatDate(new Date());
      filteredTasks = filteredTasks.filter(t => t.date > todayStr);
    } else if (currentFilter === 'completed') {
      filteredTasks = filteredTasks.filter(t => t.completed);
    }
    
    // Apply category filter if active
    if (currentCategory) {
      filteredTasks = filteredTasks.filter(t => t.category === currentCategory);
    }
    
    // Clear the list
    taskList.innerHTML = '';
    
    // Update task count
    document.querySelector('.task-count').textContent = filteredTasks.length;
    
    // Update header text
    const tasksHeaderText = currentFilter === 'all' ? 'All Tasks' : 
                           currentFilter === 'today' ? 'Today\'s Tasks' :
                           currentFilter === 'upcoming' ? 'Upcoming Tasks' : 'Completed Tasks';
                           
    document.querySelector('.tasks-header').firstChild.textContent = tasksHeaderText + ' ';
    
    // Render filtered tasks
    filteredTasks.forEach((task, index) => {
      const taskItem = document.createElement('div');
      taskItem.className = 'task-item' + (task.completed ? ' completed' : '');
      taskItem.dataset.id = task.id;
      taskItem.dataset.completed = task.completed;
      taskItem.dataset.category = task.category;
      taskItem.dataset.date = task.date;
      
      ${features.animation ? `
      // Add staggered animation
      taskItem.style.animationDelay = \`\${index * 0.05}s\`;
      ` : ''}
      
      taskItem.innerHTML = \`
        <div class="task-checkbox\${task.completed ? ' checked' : ''}"></div>
        <div class="task-content">
          <h3>\${task.title}</h3>
          <div class="task-meta">
            <span class="task-category category-\${task.category}">\${capitalizeFirstLetter(task.category)}</span>
            <span class="task-date">\${formatDisplayDate(new Date(task.date))}</span>
          </div>
        </div>
        <div class="task-actions">
          <button class="task-edit">✏️</button>
          <button class="task-delete">🗑️</button>
        </div>
      \`;
      
      taskList.appendChild(taskItem);
    });
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Initial render
  renderTasks();
});`;

  return {
    code: { html, css, js },
    explanation: "A feature-rich todo application with filtering, categorization, and task management capabilities."
  };
}
