// Storage Module
const StorageModule = (function() {
    const TASKS_KEY = 'dashboard_tasks';
    const LINKS_KEY = 'dashboard_links';
    
    function save(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
        } catch (error) {
            console.warn('Storage unavailable or quota exceeded:', error);
        }
    }
    
    function load(key) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) {
                return [];
            }
            return JSON.parse(serialized);
        } catch (error) {
            console.warn('Failed to load or parse data from storage:', error);
            return [];
        }
    }
    
    return { save, load, TASKS_KEY, LINKS_KEY };
})();

// Profanity Filter Module
const ProfanityFilter = (function() {
    // Daftar kata-kata tidak pantas (bisa ditambahkan sesuai kebutuhan)
    const profanityWords = [
        'anjing', 'babi', 'bangsat', 'bajingan', 'kampret', 'tolol', 'bodoh',
        'goblok', 'idiot', 'bego', 'kontol', 'memek', 'ngentot', 'jancok',
        'asu', 'monyet', 'tai', 'shit', 'fuck', 'damn', 'hell', 'bitch',
        'ass', 'bastard', 'crap', 'piss', 'dick', 'pussy', 'cock'
    ];
    
    // Whitelist: konteks yang diperbolehkan meskipun mengandung kata sensitif
    const allowedContexts = [
        'beri makan anjing',
        'beri makan babi',
        'beri makan monyet',
        'jalan anjing',
        'jalan babi',
        'jalan monyet',
        'anjing peliharaan',
        'babi peliharaan',
        'monyet peliharaan',
        'anjing saya',
        'babi saya',
        'monyet saya',
        'anjing kesayangan',
        'babi kesayangan',
        'monyet kesayangan',
        'merawat anjing',
        'merawat babi',
        'merawat monyet',
        'vaksin anjing',
        'vaksin babi',
        'vaksin monyet',
        'mandikan anjing',
        'mandikan babi',
        'mandikan monyet',
        'grooming anjing',
        'grooming babi',
        'grooming monyet',
        'dokter hewan anjing',
        'dokter hewan babi',
        'dokter hewan monyet',
        'makanan anjing',
        'makanan babi',
        'makanan monyet',
        'kandang anjing',
        'kandang babi',
        'kandang monyet',
        'latih anjing',
        'latih babi',
        'latih monyet',
        'adopsi anjing',
        'adopsi babi',
        'adopsi monyet',
        'rawat anjing',
        'rawat babi',
        'rawat monyet',
        'beli makanan anjing',
        'beli makanan babi',
        'beli makanan monyet',
        'periksa anjing',
        'periksa babi',
        'periksa monyet',
        'ajak anjing',
        'ajak babi',
        'ajak monyet',
        'bawa anjing',
        'bawa babi',
        'bawa monyet',
        'cuci anjing',
        'cuci babi',
        'cuci monyet',
    ];
    
    // Fungsi untuk greeting/nama - TANPA whitelist (strict)
    function containsProfanityStrict(text) {
        if (!text) return false;
        
        const lowerText = text.toLowerCase();
        
        // Langsung cek profanity tanpa whitelist
        const pattern = new RegExp('\\b(' + profanityWords.join('|') + ')\\b', 'i');
        
        return pattern.test(lowerText);
    }
    
    // Fungsi untuk todo list - DENGAN whitelist
    function containsProfanity(text) {
        if (!text) return false;
        
        const lowerText = text.toLowerCase();
        
        // Cek apakah ada dalam whitelist context
        for (let i = 0; i < allowedContexts.length; i++) {
            if (lowerText.includes(allowedContexts[i])) {
                return false; // Konteks diperbolehkan
            }
        }
        
        // Buat regex pattern dari daftar kata tidak pantas
        // Menggunakan word boundary (\b) untuk mencocokkan kata utuh
        const pattern = new RegExp('\\b(' + profanityWords.join('|') + ')\\b', 'i');
        
        return pattern.test(lowerText);
    }
    
    function getCleanText(text) {
        if (!text) return text;
        
        let cleanText = text;
        const lowerText = text.toLowerCase();
        
        // Cek whitelist dulu
        for (let i = 0; i < allowedContexts.length; i++) {
            if (lowerText.includes(allowedContexts[i])) {
                return text; // Kembalikan text asli tanpa sensor
            }
        }
        
        profanityWords.forEach(function(word) {
            const pattern = new RegExp('\\b' + word + '\\b', 'gi');
            const replacement = '*'.repeat(word.length);
            cleanText = cleanText.replace(pattern, replacement);
        });
        
        return cleanText;
    }
    
    return { 
        containsProfanityStrict,           // Untuk greeting/nama (tanpa whitelist)
        containsProfanityWithWhitelist: containsProfanity,    // Untuk todo list (dengan whitelist)
        getCleanText 
    };
})();


// Greeting Module
const GreetingModule = (function() {
    const NAME_KEY = 'dashboard_user_name';
    let userName = '';
    
    function updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        const greetingText = getGreetingByHour(hour);
        const greetingElement = document.getElementById('greeting-text');
        if (greetingElement) {
            const nameDisplay = userName ? ', ' + userName : '';
            greetingElement.textContent = greetingText + nameDisplay;
        }
    }
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    function updateDate() {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }
    
    function getGreetingByHour(hour) {
        if (hour >= 0 && hour <= 12) {
            return 'Good Morning';
        } else if (hour >= 12 && hour <= 15) {
            return 'Good Afternoon';
        } else if (hour >= 15 && hour <= 20) {
            return 'Good Evening';
        } else if (hour >= 20 && hour <= 0) {
            return 'Good Night';
        } else{
            
        }
    }
    
    function loadName() {
        try {
            const saved = localStorage.getItem(NAME_KEY);
            if (saved) {
                userName = saved;
                const nameInput = document.getElementById('name-input');
                if (nameInput) {
                    nameInput.value = userName;
                }
                hideNameInput();
                showEditButton();
            }
        } catch (error) {
            console.warn('Failed to load name:', error);
        }
    }
    
    function saveName() {
        const nameInput = document.getElementById('name-input');
        if (nameInput) {
            const newName = nameInput.value.trim();
            
            // Check for profanity - STRICT (tanpa whitelist)
            if (ProfanityFilter.containsProfanityStrict(newName)) {
                alert('Nama mengandung kata-kata tidak pantas. Silakan gunakan nama yang sopan.');
                return;
            }
            
            userName = newName;
            try {
                localStorage.setItem(NAME_KEY, userName);
            } catch (error) {
                console.warn('Failed to save name:', error);
            }
            updateGreeting();
            
            if (userName) {
                hideNameInput();
                showEditButton();
            }
        }
    }
    
    function hideNameInput() {
        const container = document.getElementById('name-input-container');
        if (container) {
            container.classList.add('hidden');
        }
    }
    
    function showNameInput() {
        const container = document.getElementById('name-input-container');
        if (container) {
            container.classList.remove('hidden');
        }
    }
    
    function showEditButton() {
        const editBtn = document.getElementById('edit-name-btn');
        if (editBtn) {
            editBtn.classList.remove('hidden');
        }
    }
    
    function hideEditButton() {
        const editBtn = document.getElementById('edit-name-btn');
        if (editBtn) {
            editBtn.classList.add('hidden');
        }
    }
    
    function editName() {
        showNameInput();
        hideEditButton();
        const nameInput = document.getElementById('name-input');
        if (nameInput) {
            nameInput.focus();
            nameInput.select();
        }
    }
    
    function init() {
        loadName();
        updateGreeting();
        updateTime();
        updateDate();
        
        // Update time every second
        setInterval(function() {
            updateTime();
            updateGreeting();
        }, 1000);
        
        // Update date every minute (in case day changes)
        setInterval(updateDate, 60000);
        
        // Save name button
        const saveNameBtn = document.getElementById('save-name-btn');
        if (saveNameBtn) {
            saveNameBtn.addEventListener('click', saveName);
        }
        
        // Edit name button
        const editNameBtn = document.getElementById('edit-name-btn');
        if (editNameBtn) {
            editNameBtn.addEventListener('click', editName);
        }
        
        // Save name on Enter key
        const nameInput = document.getElementById('name-input');
        if (nameInput) {
            nameInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    saveName();
                }
            });
        }
    }
    
    return { init };
})();

// Timer Module
const TimerModule = (function() {
    let remainingSeconds = 25 * 60; // 1500 seconds = 25 minutes
    let intervalId = null;
    let isRunning = false;
    
    function start() {
        if (isRunning) {
            return; // Prevent multiple intervals
        }
        
        isRunning = true;
        hideCompletionMessage();
        
        intervalId = setInterval(function() {
            tick();
        }, 1000);
    }
    
    function stop() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
        isRunning = false;
    }
    
    function reset() {
        stop();
        remainingSeconds = 25 * 60;
        updateDisplay();
        hideCompletionMessage();
    }
    
    function tick() {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        }
        
        if (remainingSeconds === 0) {
            stop();
            showCompletionMessage();
        }
    }
    
    function updateDisplay() {
        const displayElement = document.getElementById('timer-display');
        if (displayElement) {
            displayElement.textContent = formatTime(remainingSeconds);
        }
    }
    
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes + ':' + seconds.toString().padStart(2, '0');
    }
    
    function showCompletionMessage() {
        const completeElement = document.getElementById('timer-complete');
        if (completeElement) {
            completeElement.classList.remove('hidden');
        }
    }
    
    function hideCompletionMessage() {
        const completeElement = document.getElementById('timer-complete');
        if (completeElement) {
            completeElement.classList.add('hidden');
        }
    }
    
    function init() {
        const startButton = document.getElementById('timer-start');
        const stopButton = document.getElementById('timer-stop');
        const resetButton = document.getElementById('timer-reset');
        
        if (startButton) {
            startButton.addEventListener('click', start);
        }
        
        if (stopButton) {
            stopButton.addEventListener('click', stop);
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', reset);
        }
        
        updateDisplay();
    }
    
    return { init };
})();

// Todo Module
const TodoModule = (function() {
    let tasks = [];
    
    function generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
    
    function addTask(text) {
        const trimmedText = text.trim();
        
        // Reject empty or whitespace-only input
        if (trimmedText.length === 0) {
            return false;
        }
        
        // Check for profanity - DENGAN WHITELIST untuk todo list
        if (ProfanityFilter.containsProfanityWithWhitelist(trimmedText)) {
            alert('The text contains inappropriate words. Please use polite words.');
            return false;
        }
        
        // Check for duplicate tasks (case-insensitive)
        const isDuplicate = tasks.some(function(task) {
            return task.text.toLowerCase() === trimmedText.toLowerCase();
        });
        
        if (isDuplicate) {
            alert('This task already exists!');
            return false;
        }
        
        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(trimmedText)) {
            console.log('Email detected:', trimmedText);
        }
        
        const task = {
            id: generateId(),
            text: trimmedText,
            completed: false,
            createdAt: Date.now()
        };
        
        tasks.push(task);
        saveTasks();
        render();
        return true;
    }
    
    function toggleComplete(id) {
        const task = tasks.find(function(t) {
            return t.id === id;
        });
        
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            render();
        }
    }
    
    function editTask(id, newText) {
        const trimmedText = newText.trim();
        
        // Reject empty or whitespace-only input
        if (trimmedText.length === 0) {
            return false;
        }
        
        // Check for profanity - DENGAN WHITELIST untuk todo list
        if (ProfanityFilter.containsProfanityWithWhitelist(trimmedText)) {
            alert('The text contains inappropriate words. Please use polite words.');
            return false;
        }
        
        const task = tasks.find(function(t) {
            return t.id === id;
        });
        
        if (task) {
            task.text = trimmedText;
            saveTasks();
            render();
            return true;
        }
        
        return false;
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(function(t) {
            return t.id !== id;
        });
        saveTasks();
        render();
    }
    
    function render() {
        const listElement = document.getElementById('todo-list');
        if (!listElement) {
            return;
        }
        
        // Clear existing content
        listElement.innerHTML = '';
        
        // Render each task
        tasks.forEach(function(task) {
            const li = document.createElement('li');
            li.className = 'todo-item';
            if (task.completed) {
                li.classList.add('completed');
            }
            
            const textSpan = document.createElement('span');
            textSpan.className = 'todo-text';
            textSpan.textContent = task.text;
            
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'todo-buttons';
            
            const completeBtn = document.createElement('button');
            completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
            completeBtn.className = 'todo-complete-btn';
            completeBtn.addEventListener('click', function() {
                toggleComplete(task.id);
            });
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'todo-edit-btn';
            editBtn.addEventListener('click', function() {
                startEdit(task.id, li, textSpan);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'todo-delete-btn';
            deleteBtn.addEventListener('click', function() {
                deleteTask(task.id);
            });
            
            buttonsDiv.appendChild(completeBtn);
            buttonsDiv.appendChild(editBtn);
            buttonsDiv.appendChild(deleteBtn);
            
            li.appendChild(textSpan);
            li.appendChild(buttonsDiv);
            listElement.appendChild(li);
        });
    }
    
    function startEdit(id, li, textSpan) {
        const task = tasks.find(function(t) {
            return t.id === id;
        });
        
        if (!task) {
            return;
        }
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'todo-edit-input';
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'todo-save-btn';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'todo-cancel-btn';
        
        function finishEdit(save) {
            if (save) {
                const success = editTask(id, input.value);
                if (!success) {
                    // If validation fails, just re-render to restore original
                    render();
                }
            } else {
                render();
            }
        }
        
        saveBtn.addEventListener('click', function() {
            finishEdit(true);
        });
        
        cancelBtn.addEventListener('click', function() {
            finishEdit(false);
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                finishEdit(true);
            }
        });
        
        // Replace content with edit UI
        li.innerHTML = '';
        li.appendChild(input);
        li.appendChild(saveBtn);
        li.appendChild(cancelBtn);
        input.focus();
    }
    
    function saveTasks() {
        StorageModule.save(StorageModule.TASKS_KEY, tasks);
    }
    
    function loadTasks() {
        const loaded = StorageModule.load(StorageModule.TASKS_KEY);
        if (Array.isArray(loaded)) {
            tasks = loaded;
        } else {
            tasks = [];
        }
        render();
    }
    
    function init() {
        const form = document.getElementById('todo-form');
        const input = document.getElementById('todo-input');
        
        if (form && input) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const success = addTask(input.value);
                if (success) {
                    input.value = '';
                }
            });
        }
        
        loadTasks();
    }
    
    return { init };
})();

// Links Module
const LinksModule = (function() {
    let links = [];
    
    function generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
    
    function addLink(label, url) {
        const trimmedLabel = label.trim();
        const trimmedUrl = url.trim();
        
        // Reject empty or whitespace-only input
        if (trimmedLabel.length === 0 || trimmedUrl.length === 0) {
            return false;
        }
        
        const link = {
            id: generateId(),
            label: trimmedLabel,
            url: trimmedUrl,
            createdAt: Date.now()
        };
        
        links.push(link);
        saveLinks();
        render();
        return true;
    }
    
    function deleteLink(id) {
        links = links.filter(function(link) {
            return link.id !== id;
        });
        saveLinks();
        render();
    }
    
    function openLink(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    
    function render() {
        const container = document.getElementById('links-container');
        if (!container) {
            return;
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Render each link
        links.forEach(function(link) {
            const linkItem = document.createElement('div');
            linkItem.className = 'link-item';
            
            const linkBtn = document.createElement('button');
            linkBtn.className = 'link-btn';
            linkBtn.textContent = link.label;
            linkBtn.addEventListener('click', function() {
                openLink(link.url);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-link-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                deleteLink(link.id);
            });
            
            linkItem.appendChild(linkBtn);
            linkItem.appendChild(deleteBtn);
            container.appendChild(linkItem);
        });
    }
    
    function saveLinks() {
        StorageModule.save(StorageModule.LINKS_KEY, links);
    }
    
    function loadLinks() {
        const loaded = StorageModule.load(StorageModule.LINKS_KEY);
        if (Array.isArray(loaded)) {
            links = loaded;
        } else {
            links = [];
        }
        render();
    }
    
    function init() {
        const form = document.getElementById('links-form');
        const labelInput = document.getElementById('link-label');
        const urlInput = document.getElementById('link-url');
        
        if (form && labelInput && urlInput) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const success = addLink(labelInput.value, urlInput.value);
                if (success) {
                    labelInput.value = '';
                    urlInput.value = '';
                }
            });
        }
        
        loadLinks();
    }
    
    return { init };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const THEME_KEY = 'dashboard_theme';
    
    // Load saved theme
    function loadTheme() {
        try {
            const savedTheme = localStorage.getItem(THEME_KEY);
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                if (themeIcon) themeIcon.textContent = '☀️';
            } else {
                if (themeIcon) themeIcon.textContent = '🌙';
            }
        } catch (error) {
            console.warn('Failed to load theme:', error);
        }
    }
    
    // Toggle theme
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        }
        
        try {
            localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    loadTheme();
    
    GreetingModule.init();
    TimerModule.init();
    TodoModule.init();
    LinksModule.init();
});
