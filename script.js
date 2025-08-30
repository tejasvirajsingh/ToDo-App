// Grab HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const filterBtns = document.querySelectorAll(".filter-btn");

// Store tasks (will also use localStorage)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add Task
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = ""; // clear input
});

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Toggle Complete
function toggleComplete(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks on UI
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span onclick="toggleComplete(${task.id})">${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})">❌</button>
    `;
    taskList.appendChild(li);
  });

  // Update counter
  const pendingCount = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `${pendingCount} task(s) left`;
}

// Handle Filters
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

// Initial render
renderTasks();
