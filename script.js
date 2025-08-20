// Select elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    if (filter === "completed" && !task.completed) return;
    if (filter === "pending" && task.completed) return;

    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span class="task-text" contenteditable="false">${task.text}</span>
      <div class="actions">
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="editTask(${index}, this)">✏️</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Add task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Toggle complete
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Edit task
function editTask(index, btn) {
  const li = btn.closest("li");
  const span = li.querySelector(".task-text");

  if (span.contentEditable === "true") {
    // Save update
    span.contentEditable = "false";
    tasks[index].text = span.textContent;
    saveTasks();
    btn.textContent = "✏️";
  } else {
    // Enable editing
    span.contentEditable = "true";
    span.focus();
    btn.textContent = "💾";
  }
}

// Clear all
clearAllBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

// Filter
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

// Enter key adds task
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

// Initial render
renderTasks();
