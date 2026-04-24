# Life Dashboard - Integration Test Guide

## Task 10: Integration and Initialization

This guide provides step-by-step instructions to verify that all modules are properly integrated and data persistence works correctly.

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- The application files: `index.html`, `app.js`, and `styles.css`

---

## Test 10.1: Module Integration Verification

### Objective
Verify that all four modules (GreetingModule, TimerModule, TodoModule, LinksModule) are properly initialized and functioning when the page loads.

### Steps

1. **Open the Application**
   - Open `index.html` in your web browser
   - You can do this by:
     - Double-clicking the file
     - Right-click → Open with → [Your Browser]
     - Or use a local server: `python -m http.server 8000` or `npx serve`

2. **Verify GreetingModule**
   - ✓ Check that a greeting message is displayed (e.g., "Good Morning", "Good Afternoon", etc.)
   - ✓ Check that the current time is displayed and updates every second
   - ✓ Check that the current date is displayed in a readable format (e.g., "Monday, January 1, 2024")
   
   **Expected Result:** All three elements should be visible and updating in real-time.

3. **Verify TimerModule**
   - ✓ Check that the timer displays "25:00" initially
   - ✓ Click the "Start" button - timer should begin counting down
   - ✓ Click the "Stop" button - timer should pause
   - ✓ Click the "Start" button again - timer should resume from where it stopped
   - ✓ Click the "Reset" button - timer should return to "25:00"
   - ✓ Let the timer run to 0:00 - a "Session Complete!" message should appear
   
   **Expected Result:** All timer controls work correctly and the countdown is accurate.

4. **Verify TodoModule**
   - ✓ Check that the todo list section is visible with an input field and "Add" button
   - ✓ Type a task name and click "Add" - task should appear in the list
   - ✓ Try to add an empty task - it should be rejected (nothing happens)
   - ✓ Click "Complete" on a task - it should show strikethrough styling
   - ✓ Click "Undo" on a completed task - strikethrough should be removed
   - ✓ Click "Edit" on a task - an input field should appear
   - ✓ Edit the task text and click "Save" - the task should update
   - ✓ Click "Delete" on a task - it should be removed from the list
   
   **Expected Result:** All todo operations work correctly with proper visual feedback.

5. **Verify LinksModule**
   - ✓ Check that the quick links section is visible with label and URL input fields
   - ✓ Enter a label (e.g., "Google") and URL (e.g., "https://google.com") and click "Add Link"
   - ✓ The link should appear as a button
   - ✓ Click the link button - it should open in a new tab
   - ✓ Try to add a link with empty label or URL - it should be rejected
   - ✓ Click "Delete" on a link - it should be removed
   
   **Expected Result:** All link operations work correctly and links open in new tabs.

6. **Open Browser Console**
   - Press F12 to open Developer Tools
   - Go to the Console tab
   - ✓ Check for any JavaScript errors (there should be none)
   - ✓ You may see informational messages, but no errors
   
   **Expected Result:** No JavaScript errors in the console.

### Test 10.1 Result
- [ ] All modules initialized successfully
- [ ] All widgets are visible and functional
- [ ] No JavaScript errors in console

---

## Test 10.2: Data Persistence Verification

### Objective
Verify that tasks and links persist across page reloads and that the application handles localStorage unavailability gracefully.

### Part A: Normal Data Persistence

1. **Add Test Data**
   - Add 3 tasks:
     - "Test Task 1"
     - "Test Task 2" (mark as complete)
     - "Test Task 3"
   - Add 2 links:
     - Label: "GitHub", URL: "https://github.com"
     - Label: "MDN", URL: "https://developer.mozilla.org"

2. **Verify Data in localStorage**
   - Open Browser DevTools (F12)
   - Go to Application tab (Chrome) or Storage tab (Firefox)
   - Navigate to Local Storage → [your domain/file]
   - ✓ Check for key `dashboard_tasks` - should contain your tasks as JSON
   - ✓ Check for key `dashboard_links` - should contain your links as JSON
   
   **Expected Result:** Both keys exist with properly formatted JSON data.

3. **Test Page Reload**
   - Reload the page (F5 or Ctrl+R / Cmd+R)
   - ✓ All 3 tasks should still be present
   - ✓ Task 2 should still be marked as complete (strikethrough)
   - ✓ Both links should still be present
   
   **Expected Result:** All data persists after reload.

4. **Test Browser Restart**
   - Close the browser completely
   - Reopen the browser and open `index.html` again
   - ✓ All tasks and links should still be present
   
   **Expected Result:** Data persists even after browser restart.

### Part B: localStorage Unavailable (Memory-Only Mode)

1. **Disable localStorage**
   - Open Browser DevTools (F12)
   - Go to Application/Storage tab
   - Right-click on Local Storage → Clear
   - Or in Console, run: `localStorage.clear()`

2. **Test Application Functionality**
   - Add a new task
   - Add a new link
   - ✓ Both should work normally and appear in the UI
   - ✓ Check console for warning messages about storage unavailability
   
   **Expected Result:** Application continues to work in memory-only mode.

3. **Test Reload with Disabled Storage**
   - Reload the page
   - ✓ Previously added data (from memory) should be gone
   - ✓ Application should still load and function normally
   
   **Expected Result:** Application gracefully handles missing data.

### Part C: Corrupted Data Handling

1. **Add Corrupted Data**
   - Open Browser DevTools Console
   - Run: `localStorage.setItem('dashboard_tasks', 'invalid json {{')`
   - Reload the page

2. **Verify Graceful Handling**
   - ✓ Application should load without crashing
   - ✓ Todo list should be empty (corrupted data ignored)
   - ✓ Check console for warning about failed parsing
   - ✓ You should be able to add new tasks normally
   
   **Expected Result:** Application handles corrupted data gracefully.

### Test 10.2 Result
- [ ] Data persists across page reloads
- [ ] Data persists across browser restarts
- [ ] Application works when localStorage is unavailable
- [ ] Application handles corrupted data gracefully

---

## Automated Test Option

For a more automated approach, you can use the provided test files:

### Option 1: Browser-Based Test
1. Open `test-integration.html` in your browser
2. Click the test buttons to run automated checks
3. Review the test results displayed on the page

### Option 2: Manual Verification
Follow the steps in this guide to manually verify all functionality.

---

## Success Criteria

The integration is considered successful when:

- [x] All four modules are defined and initialized in `app.js`
- [x] DOMContentLoaded event listener calls all module init() functions
- [ ] All widgets render correctly on page load (manual verification required)
- [ ] All interactive features work as expected (manual verification required)
- [ ] Data persists across page reloads (manual verification required)
- [ ] Application handles localStorage errors gracefully (manual verification required)

---

## Code Verification

### Integration Code Location
File: `app.js` (lines 531-536)

```javascript
// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    GreetingModule.init();
    TimerModule.init();
    TodoModule.init();
    LinksModule.init();
});
```

### Module Structure Verification

All modules follow the Revealing Module Pattern:

1. **StorageModule** (lines 1-30)
   - Provides: `save()`, `load()`, `TASKS_KEY`, `LINKS_KEY`
   - Handles localStorage operations with error handling

2. **GreetingModule** (lines 32-95)
   - Provides: `init()`
   - Updates greeting, time, and date displays

3. **TimerModule** (lines 97-185)
   - Provides: `init()`
   - Manages 25-minute countdown timer

4. **TodoModule** (lines 187-380)
   - Provides: `init()`
   - Manages task CRUD operations and persistence

5. **LinksModule** (lines 382-529)
   - Provides: `init()`
   - Manages link CRUD operations and persistence

---

## Troubleshooting

### Issue: Modules not initializing
- **Check:** Open browser console for errors
- **Solution:** Ensure all JavaScript files are loaded correctly

### Issue: Data not persisting
- **Check:** Browser DevTools → Application → Local Storage
- **Solution:** Ensure localStorage is enabled in browser settings

### Issue: Styling looks broken
- **Check:** Ensure `styles.css` is in the same directory as `index.html`
- **Solution:** Check browser console for CSS loading errors

### Issue: Timer not counting down
- **Check:** Click "Start" button and wait a few seconds
- **Solution:** Ensure JavaScript is enabled in browser

---

## Requirements Mapping

This integration test verifies the following requirements:

- **Requirement 9.1:** All four widgets render on a single page
- **Requirement 8.1:** Task collection stored in localStorage
- **Requirement 8.2:** Link collection stored in localStorage
- **Requirement 8.3:** Graceful handling when localStorage is unavailable

---

## Conclusion

After completing all tests in this guide, you should have verified that:

1. All modules are properly integrated and initialized
2. All widgets load and function correctly
3. Data persists across page reloads
4. The application handles storage errors gracefully

If all tests pass, Task 10 (Integration and Initialization) is complete!
