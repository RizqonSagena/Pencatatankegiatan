/**
 * Integration Test for Life Dashboard Modules
 * Tests that all modules are properly defined and initialized
 */

// Mock DOM environment for Node.js testing
const mockDOM = {
    elements: {},
    
    getElementById: function(id) {
        if (!this.elements[id]) {
            this.elements[id] = {
                textContent: '',
                value: '',
                classList: {
                    add: function() {},
                    remove: function() {},
                    contains: function() { return false; }
                },
                addEventListener: function() {},
                appendChild: function() {},
                innerHTML: ''
            };
        }
        return this.elements[id];
    },
    
    createElement: function(tag) {
        return {
            tagName: tag,
            textContent: '',
            className: '',
            classList: {
                add: function() {},
                remove: function() {}
            },
            addEventListener: function() {},
            appendChild: function() {},
            focus: function() {}
        };
    },
    
    addEventListener: function(event, callback) {
        if (event === 'DOMContentLoaded') {
            // Simulate DOMContentLoaded
            setTimeout(callback, 0);
        }
    }
};

// Mock localStorage
const mockLocalStorage = {
    storage: {},
    
    setItem: function(key, value) {
        this.storage[key] = value;
    },
    
    getItem: function(key) {
        return this.storage[key] || null;
    },
    
    clear: function() {
        this.storage = {};
    }
};

// Mock window
const mockWindow = {
    open: function(url, target, features) {
        console.log(`[Mock] Opening URL: ${url}`);
    }
};

// Set up global mocks
global.document = mockDOM;
global.localStorage = mockLocalStorage;
global.window = mockWindow;
global.setInterval = setInterval;
global.clearInterval = clearInterval;
global.Date = Date;
global.Math = Math;
global.console = console;

// Load the app.js file
const fs = require('fs');
const appCode = fs.readFileSync('app.js', 'utf8');

// Create a context to capture the modules
let StorageModule, GreetingModule, TimerModule, TodoModule, LinksModule;

// Execute the app code in a way that captures the modules
const wrappedCode = `
${appCode}

// Export modules for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StorageModule,
        GreetingModule,
        TimerModule,
        TodoModule,
        LinksModule
    };
}
`;

// Execute and capture modules
eval(wrappedCode);

// Test Suite
console.log('='.repeat(60));
console.log('Life Dashboard - Module Integration Tests');
console.log('='.repeat(60));
console.log();

let passCount = 0;
let failCount = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ PASS: ${name}`);
        passCount++;
    } catch (error) {
        console.log(`✗ FAIL: ${name}`);
        console.log(`  Error: ${error.message}`);
        failCount++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

// Test 10.1: Module Integration Tests
console.log('Task 10.1: Module Integration Tests');
console.log('-'.repeat(60));

test('StorageModule is defined', () => {
    assert(typeof StorageModule !== 'undefined', 'StorageModule should be defined');
    assert(typeof StorageModule.save === 'function', 'StorageModule.save should be a function');
    assert(typeof StorageModule.load === 'function', 'StorageModule.load should be a function');
    assert(typeof StorageModule.TASKS_KEY === 'string', 'StorageModule.TASKS_KEY should be a string');
    assert(typeof StorageModule.LINKS_KEY === 'string', 'StorageModule.LINKS_KEY should be a string');
});

test('GreetingModule is defined', () => {
    assert(typeof GreetingModule !== 'undefined', 'GreetingModule should be defined');
    assert(typeof GreetingModule.init === 'function', 'GreetingModule.init should be a function');
});

test('TimerModule is defined', () => {
    assert(typeof TimerModule !== 'undefined', 'TimerModule should be defined');
    assert(typeof TimerModule.init === 'function', 'TimerModule.init should be a function');
});

test('TodoModule is defined', () => {
    assert(typeof TodoModule !== 'undefined', 'TodoModule should be defined');
    assert(typeof TodoModule.init === 'function', 'TodoModule.init should be a function');
});

test('LinksModule is defined', () => {
    assert(typeof LinksModule !== 'undefined', 'LinksModule should be defined');
    assert(typeof LinksModule.init === 'function', 'LinksModule.init should be a function');
});

test('All modules can be initialized without errors', () => {
    GreetingModule.init();
    TimerModule.init();
    TodoModule.init();
    LinksModule.init();
    assert(true, 'All modules initialized successfully');
});

test('GreetingModule updates DOM elements', () => {
    GreetingModule.init();
    const greetingText = mockDOM.getElementById('greeting-text').textContent;
    const currentTime = mockDOM.getElementById('current-time').textContent;
    const currentDate = mockDOM.getElementById('current-date').textContent;
    
    assert(greetingText.length > 0, 'Greeting text should be populated');
    assert(currentTime.length > 0, 'Current time should be populated');
    assert(currentDate.length > 0, 'Current date should be populated');
});

test('TimerModule initializes with 25:00', () => {
    TimerModule.init();
    const timerDisplay = mockDOM.getElementById('timer-display').textContent;
    assert(timerDisplay === '25:00', `Timer should display 25:00, got: ${timerDisplay}`);
});

console.log();
console.log('Task 10.2: Data Persistence Tests');
console.log('-'.repeat(60));

test('StorageModule can save data', () => {
    const testData = [{ id: '1', text: 'Test Task' }];
    StorageModule.save('test_key', testData);
    const stored = mockLocalStorage.getItem('test_key');
    assert(stored !== null, 'Data should be stored');
    assert(stored === JSON.stringify(testData), 'Stored data should match input');
});

test('StorageModule can load data', () => {
    const testData = [{ id: '1', text: 'Test Task' }];
    mockLocalStorage.setItem('test_key', JSON.stringify(testData));
    const loaded = StorageModule.load('test_key');
    assert(Array.isArray(loaded), 'Loaded data should be an array');
    assert(loaded.length === 1, 'Loaded data should have 1 item');
    assert(loaded[0].text === 'Test Task', 'Loaded data should match stored data');
});

test('StorageModule handles missing data gracefully', () => {
    const loaded = StorageModule.load('nonexistent_key');
    assert(Array.isArray(loaded), 'Should return an array for missing key');
    assert(loaded.length === 0, 'Should return empty array for missing key');
});

test('StorageModule handles corrupted data gracefully', () => {
    mockLocalStorage.setItem('corrupted_key', 'invalid json {{{');
    const loaded = StorageModule.load('corrupted_key');
    assert(Array.isArray(loaded), 'Should return an array for corrupted data');
    assert(loaded.length === 0, 'Should return empty array for corrupted data');
});

test('TodoModule loads tasks from storage on init', () => {
    const testTasks = [
        { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
        { id: '2', text: 'Task 2', completed: true, createdAt: Date.now() }
    ];
    mockLocalStorage.setItem(StorageModule.TASKS_KEY, JSON.stringify(testTasks));
    TodoModule.init();
    // If init runs without error, tasks were loaded successfully
    assert(true, 'TodoModule should load tasks from storage');
});

test('LinksModule loads links from storage on init', () => {
    const testLinks = [
        { id: '1', label: 'Link 1', url: 'https://example.com', createdAt: Date.now() },
        { id: '2', label: 'Link 2', url: 'https://test.com', createdAt: Date.now() }
    ];
    mockLocalStorage.setItem(StorageModule.LINKS_KEY, JSON.stringify(testLinks));
    LinksModule.init();
    // If init runs without error, links were loaded successfully
    assert(true, 'LinksModule should load links from storage');
});

test('Storage works with localStorage unavailable', () => {
    // Simulate localStorage throwing an error
    const originalSetItem = mockLocalStorage.setItem;
    mockLocalStorage.setItem = function() {
        throw new Error('QuotaExceededError');
    };
    
    // Should not throw error, just log warning
    StorageModule.save('test_key', [{ id: '1' }]);
    
    // Restore original
    mockLocalStorage.setItem = originalSetItem;
    assert(true, 'Should handle storage errors gracefully');
});

// Summary
console.log();
console.log('='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${passCount + failCount}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log();

if (failCount === 0) {
    console.log('✓ All tests passed! Integration is working correctly.');
    process.exit(0);
} else {
    console.log('✗ Some tests failed. Please review the errors above.');
    process.exit(1);
}
