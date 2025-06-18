// public/script.js
document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("add-todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const loader = document.getElementById("loader");

  const API_URL = "/api/todos";

  /**
   * Shows or hides the loader animation.
   * @param {boolean} show - True to show the loader, false to hide it.
   */
  const showLoader = (show) => {
    loader.style.display = show ? "flex" : "none";
  };

  /**
   * Renders a single todo item to the DOM.
   * @param {object} todo - The todo object ({ id, title, completed }).
   */
  const renderTodo = (todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo.id;
    if (todo.completed) {
      li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.textContent = todo.title;
    // Event listener to toggle completion status
    span.addEventListener("click", () => toggleTodo(todo.id, !todo.completed));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "&times;"; // '×' symbol
    // Event listener to delete a todo
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  };

  /**
   * Fetches all todos from the API and renders them.
   */
  const fetchTodos = async () => {
    showLoader(true);
    todoList.innerHTML = ""; // Clear the list before fetching
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const todos = await response.json();
      todos.forEach(renderTodo);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      todoList.innerHTML =
        '<li class="todo-item">Failed to load todos. Please try again later.</li>';
    } finally {
      showLoader(false);
    }
  };

  /**
   * Handles the submission of the 'add todo' form.
   */
  todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    if (!title) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error("Failed to create todo.");
      // Re-fetch all todos to see the new one at the top.
      // A more optimized approach might just render the returned todo.
      fetchTodos();
      todoInput.value = "";
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  });

  /**
   * Toggles the completed status of a todo.
   * @param {number} id - The ID of the todo to update.
   * @param {boolean} completed - The new completed status.
   */
  const toggleTodo = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error("Failed to update todo.");

      // Find the list item in the DOM and toggle its class
      const li = todoList.querySelector(`[data-id='${id}']`);
      if (li) {
        li.classList.toggle("completed", completed);
        // Also update the event listener with the new state
        const span = li.querySelector("span");
        span.replaceWith(span.cloneNode(true)); // a trick to remove old event listeners
        li.querySelector("span").textContent = span.textContent;
        li.querySelector("span").addEventListener("click", () =>
          toggleTodo(id, !completed)
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  /**
   * Deletes a todo item.
   * @param {number} id - The ID of the todo to delete.
   */
  const deleteTodo = async (id) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete todo.");

      // Remove the list item from the DOM
      const li = todoList.querySelector(`[data-id='${id}']`);
      if (li) {
        li.remove();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Initial fetch of todos when the page loads
  fetchTodos();
});
