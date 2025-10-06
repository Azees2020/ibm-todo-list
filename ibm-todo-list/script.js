// Reference to input and task list
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Add Task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const taskId = crypto.randomUUID(); // Unique ID for each task
  const timestamp = new Date().toLocaleString(); // Current date and time

  createTaskElement(taskText, false, taskId, timestamp);
  saveTasks(); // Save to local storage
  taskInput.value = ""; // Clear input
}

// Function to create a task element
function createTaskElement(taskText, isCompleted, taskId, timestamp) {
  const li = document.createElement("li");
  li.setAttribute("data-id", taskId); // Set data-id for unique identification
  if (isCompleted) {
    li.classList.add("completed");
  }

  // Task text (made editable)
  const span = document.createElement("span");
  span.textContent = taskText;
  span.contentEditable = true; // Make text editable
  span.spellcheck = false; // Disable spellcheck for better editing experience
  // Optional: Enable select-all-on-focus for accessibility
  const SELECT_ALL_ON_FOCUS = false; // Set to true to enable
  
  span.addEventListener('focus', function() {
    if (SELECT_ALL_ON_FOCUS) {
      const range = document.createRange();
      range.selectNodeContents(this);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
  span.addEventListener('blur', () => {
    saveTasks(); // Save changes when blurring
  });
  span.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent new line
      span.blur(); // Remove focus
    }
  });


  // Timestamp
  const timeSpan = document.createElement("span");
  timeSpan.textContent = timestamp;
  timeSpan.classList.add("timestamp");

  // Buttons Container
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");

  // Complete button with icon
  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = isCompleted ? '<i class="fas fa-check-circle"></i>' : '<i class="far fa-circle"></i>';
  completeBtn.classList.add("complete");
  completeBtn.onclick = () => {
    li.classList.toggle("completed");
    // Toggle between tick and non-tick icons
    if (li.classList.contains("completed")) {
      completeBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
      completeBtn.innerHTML = '<i class="far fa-circle"></i>';
    }
    saveTasks(); // Save changes after toggling completion
  };

  // Delete button with icon
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.classList.add("delete");
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks(); // Save changes after deleting
  };

  // Append elements
  li.appendChild(span);
  li.appendChild(timeSpan); // Add timestamp
  actionsDiv.appendChild(completeBtn);
  actionsDiv.appendChild(deleteBtn);
  li.appendChild(actionsDiv); // Add actions div

  taskList.appendChild(li);
}

// Save tasks to local storage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({
      id: li.getAttribute("data-id"),
      text: li.querySelector("span:not(.timestamp)").textContent, // Exclude timestamp span
      completed: li.classList.contains("completed"),
      timestamp: li.querySelector(".timestamp").textContent
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed, task.id, task.timestamp);
  });
}