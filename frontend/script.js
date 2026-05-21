const API_URL = "http://localhost:8080/tasks";

// Selectors
const authPage = document.getElementById("authPage");
const appPage = document.getElementById("appPage");
const loginSection = document.getElementById("loginSection");
const signupSection = document.getElementById("signupSection");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const toSignup = document.getElementById("toSignup");
const toLogin = document.getElementById("toLogin");
const showLoginNav = document.getElementById("showLoginNav");
const showSignupNav = document.getElementById("showSignupNav");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const reminderInput = document.getElementById("reminderInput");
const startByInput = document.getElementById("startByInput");
const taskListDashboard = document.getElementById("taskListDashboard");
const taskListFull = document.getElementById("taskListFull");
const taskCount = document.getElementById("taskCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const loadingIndicator = document.getElementById("loadingIndicator");
const refreshButton = document.getElementById("refreshButton");
const addButton = document.getElementById("addButton");
const openFormBtn = document.getElementById("openFormBtn");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

let allTasks = [];

// --- Authentication Logic ---

function toggleAuthMode(mode) {
    if (mode === 'signup') {
        loginSection.classList.add("hidden");
        signupSection.classList.remove("hidden");
        signupSection.classList.add("active");
    } else {
        signupSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
        loginSection.classList.add("active");
    }
    if (window.lucide) lucide.createIcons();
}

toSignup.addEventListener("click", (e) => { e.preventDefault(); toggleAuthMode('signup'); });
toLogin.addEventListener("click", (e) => { e.preventDefault(); toggleAuthMode('login'); });
showLoginNav.addEventListener("click", () => toggleAuthMode('login'));
showSignupNav.addEventListener("click", () => toggleAuthMode('signup'));

function login() {
    localStorage.setItem("isLoggedIn", "true");
    authPage.classList.add("hidden");
    appPage.classList.remove("hidden");
    loadTasks();
    if (window.lucide) lucide.createIcons();
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login(); // Simulate signup -> login
});

// Logout logic
document.querySelector(".nav-item.logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    appPage.classList.add("hidden");
    authPage.classList.remove("hidden");
    toggleAuthMode('login');
});

// --- Tab Switching Logic ---

navItems.forEach(item => {
    item.addEventListener("click", (e) => {
        if (item.classList.contains('logout')) return;
        e.preventDefault();

        navItems.forEach(nav => nav.classList.remove("active"));
        pages.forEach(page => page.classList.remove("active"));

        item.classList.add("active");

        // Show corresponding page
        const span = item.querySelector("span");
        if (!span) return;
        const text = span.textContent.toLowerCase();
        localStorage.setItem("activeTab", text);
        
        let targetPage;
        if (text === "dashboard") targetPage = document.getElementById("dashboardPage");
        else if (text === "my tasks") targetPage = document.getElementById("tasksPage");
        else if (text === "schedule") targetPage = document.getElementById("schedulePage");
        else if (text === "team") targetPage = document.getElementById("teamPage");
        else if (text === "settings") targetPage = document.getElementById("settingsPage");

        if (targetPage) {
            targetPage.classList.add("active");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (window.lucide) lucide.createIcons();
    });
});

// --- Modal Control ---

openFormBtn.addEventListener("click", () => {
    taskModal.classList.remove("hidden");
});

[closeModalBtn, cancelBtn].forEach(btn => {
    btn.addEventListener("click", () => taskModal.classList.add("hidden"));
});

// --- Task Management Logic ---

async function loadTasks() {
    showLoading(true);
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        allTasks = await response.json();
        renderTasks(allTasks);
        updateStats(allTasks);
    } catch (error) {
        console.error("Sync error:", error);
    } finally {
        showLoading(false);
    }
}

function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    if (taskCount) animateValue(taskCount, total);
    if (pendingCount) animateValue(pendingCount, pending);
    if (completedCount) animateValue(completedCount, completed);
}

function animateValue(obj, value) {
    let start = parseInt(obj.textContent) || 0;
    if (start === value) return;
    let duration = 400;
    let startTime = null;
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = Math.min((timestamp - startTime) / duration, 1);
        obj.textContent = Math.floor(progress * (value - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}

function renderTasks(tasks) {
    [taskListDashboard, taskListFull].forEach(list => {
        if (!list) return;
        list.innerHTML = "";
        
        const displayTasks = list.id === "taskListDashboard" 
            ? tasks.filter(t => !t.completed).slice(0, 5) 
            : [...tasks].sort((a, b) => a.completed - b.completed);

        if (displayTasks.length === 0) {
            list.innerHTML = `<div class="empty-state"><p>No tasks found.</p></div>`;
            return;
        }

        displayTasks.forEach(task => {
            const item = document.createElement("div");
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="task-content">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} 
                            onchange="toggleTaskCompletion(${task.id}, this.checked)">
                        <span class="task-title" style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                            ${escapeHtml(task.title)}
                        </span>
                    </div>
                    <div class="task-meta">
                        <span class="task-reminder">${escapeHtml(task.reminder || "No notes")}</span>
                        <span class="task-date"><i data-lucide="calendar" style="width: 12px;"></i> ${formatDateTime(task.startBy)}</span>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})"><i data-lucide="trash-2"></i></button>
            `;
            list.appendChild(item);
        });
    });

    if (window.lucide) lucide.createIcons();
}

async function toggleTaskCompletion(id, completed) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...task, completed })
        });
        if (!response.ok) throw new Error("Update failed");
        task.completed = completed;
        renderTasks(allTasks);
        updateStats(allTasks);
    } catch (error) {
        console.error(error);
    }
}

async function addTask(event) {
    if (event) event.preventDefault();
    const title = taskInput.value.trim();
    const reminder = reminderInput.value.trim();
    const startBy = startByInput.value;

    if (!title || !startBy) return;

    setSubmitting(true);
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, reminder, startBy, completed: false })
        });
        if (!response.ok) throw new Error("Add failed");

        taskInput.value = "";
        reminderInput.value = "";
        startByInput.value = "";
        taskModal.classList.add("hidden");
        
        await loadTasks();
    } catch (error) {
        console.error(error);
    } finally {
        setSubmitting(false);
    }
}

async function deleteTask(id) {
    if (!confirm("Delete task?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Delete failed");
        allTasks = allTasks.filter(t => t.id !== id);
        renderTasks(allTasks);
        updateStats(allTasks);
    } catch (error) {
        console.error(error);
    }
}

function showLoading(isLoading) {
    if (loadingIndicator) loadingIndicator.classList.toggle("hidden", !isLoading);
}

function setSubmitting(isSubmitting) {
    addButton.disabled = isSubmitting;
    addButton.innerHTML = isSubmitting ? `Saving...` : `<i data-lucide="plus"></i> Create Task`;
}

function formatDateTime(isoString) {
    if (!isoString) return "No date";
    return new Date(isoString).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

taskForm.addEventListener("submit", addTask);
refreshButton.addEventListener("click", loadTasks);

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        login();
        
        // Restore active tab
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) {
            const tabToClick = Array.from(navItems).find(item => 
                item.querySelector("span")?.textContent.toLowerCase() === savedTab
            );
            if (tabToClick) tabToClick.click();
        }
    }
    if (window.lucide) lucide.createIcons();
});
