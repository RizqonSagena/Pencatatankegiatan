const TaskMaster = (() => {
    // State
    let tasks = [];
    let userName = localStorage.getItem('tm_user_name') || '';
    let isDarkMode = localStorage.getItem('tm_theme') !== 'light';

    // Constants
    const STORAGE_KEY = 'tm_tasks';

    // DOM Elements
    const elements = {
        greeting: document.getElementById('greeting-text'),
        userNameDisplay: document.getElementById('user-name-display'),
        currentDate: document.getElementById('current-date'),
        progressPercentage: document.getElementById('progress-percentage'),
        progressFill: document.getElementById('progress-fill'),
        priorityWarning: document.getElementById('priority-warning'),
        todoForm: document.getElementById('todo-form'),
        todoInput: document.getElementById('todo-input'),
        priorityCheck: document.getElementById('priority-check'),
        priorityList: document.getElementById('priority-list'),
        normalList: document.getElementById('normal-list'),
        priorityCount: document.getElementById('priority-count'),
        normalCount: document.getElementById('normal-count'),
        themeToggle: document.getElementById('theme-toggle'),
        successMessage: document.getElementById('success-message'),
        nameModal: document.getElementById('name-modal'),
        nameInput: document.getElementById('name-input'),
        saveNameBtn: document.getElementById('save-name-btn')
    };

    // Initialize
    const init = () => {
        loadTasks();
        setupEventListeners();
        updateDate();
        updateUI();
        checkName();
        applyTheme();
        
        // Refresh date and progress every minute
        setInterval(() => {
            updateDate();
            updateProgress(); // Pastikan progress dicek saat ganti hari
        }, 60000);
    };

    const setupEventListeners = () => {
        elements.todoForm.addEventListener('submit', handleTaskSubmit);
        elements.themeToggle.addEventListener('click', toggleTheme);
        elements.saveNameBtn.addEventListener('click', saveName);
        elements.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveName();
        });
    };

    // Task Management
    const loadTasks = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        tasks = saved ? JSON.parse(saved) : [];
    };

    const saveTasks = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        updateUI();
    };

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        const text = elements.todoInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now(),
            text,
            priority: elements.priorityCheck.checked,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask);
        elements.todoInput.value = '';
        elements.priorityCheck.checked = false;
        saveTasks();
    };

    const toggleTask = (id) => {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
    };

    // UI Updates
    const updateUI = () => {
        renderTasks();
        updateProgress();
        checkPriorityWarning();
        updateCounts();
    };

    const renderTasks = () => {
        elements.priorityList.innerHTML = '';
        elements.normalList.innerHTML = '';

        tasks.forEach(task => {
            const li = createTaskElement(task);
            if (task.priority) {
                elements.priorityList.appendChild(li);
            } else {
                elements.normalList.appendChild(li);
            }
        });
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="checkbox-container">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            </div>
            <div class="task-content">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="action-btn delete-btn" title="Delete Task">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

        li.querySelector('.task-checkbox').onclick = () => toggleTask(task.id);
        li.querySelector('.delete-btn').onclick = () => deleteTask(task.id);

        return li;
    };

    const updateProgress = () => {
        const today = new Date().toLocaleDateString();
        
        // Filter tugas yang dibuat hari ini
        const todayTasks = tasks.filter(t => {
            const taskDate = new Date(t.createdAt).toLocaleDateString();
            return taskDate === today;
        });

        if (todayTasks.length === 0) {
            elements.progressPercentage.textContent = '0%';
            elements.progressFill.style.width = '0%';
            elements.successMessage.classList.add('hidden');
            return;
        }

        const completedToday = todayTasks.filter(t => t.completed).length;
        const percentage = Math.round((completedToday / todayTasks.length) * 100);
        
        elements.progressPercentage.textContent = `${percentage}%`;
        elements.progressFill.style.width = `${percentage}%`;

        // Tampilkan ucapan selamat jika sudah 100%
        if (percentage === 100) {
            elements.successMessage.classList.remove('hidden');
        } else {
            elements.successMessage.classList.add('hidden');
        }
    };

    const checkPriorityWarning = () => {
        const pendingPriority = tasks.some(t => t.priority && !t.completed);
        elements.priorityWarning.classList.toggle('hidden', !pendingPriority);
    };

    const updateCounts = () => {
        elements.priorityCount.textContent = tasks.filter(t => t.priority).length;
        elements.normalCount.textContent = tasks.filter(t => !t.priority).length;
    };

    // User Management
    const checkName = () => {
        if (!userName) {
            elements.nameModal.classList.remove('hidden');
        } else {
            elements.userNameDisplay.textContent = userName;
        }
    };

    const saveName = () => {
        const name = elements.nameInput.value.trim();
        if (name) {
            userName = name;
            localStorage.setItem('tm_user_name', name);
            elements.userNameDisplay.textContent = name;
            elements.nameModal.classList.add('hidden');
        }
    };

    // Helpers
    const updateDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        elements.currentDate.textContent = new Date().toLocaleDateString('en-US', options);
    };

    const toggleTheme = () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('tm_theme', isDarkMode ? 'dark' : 'light');
        applyTheme();
    };

    const applyTheme = () => {
        document.body.classList.toggle('light-mode', !isDarkMode);
        elements.themeToggle.innerHTML = isDarkMode ? '<span>🌙</span>' : '<span>☀️</span>';
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', TaskMaster.init);
