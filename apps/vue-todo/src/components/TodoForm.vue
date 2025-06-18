<template>
  <form @submit.prevent="addTodo" class="todo-form">
    <input
      v-model="newTodoTitle"
      placeholder="What needs to be done?"
      required
      autocomplete="off"
    />
    <button type="submit">Add Todo</button>
  </form>
</template>

<script setup>
import { ref } from "vue";

const newTodoTitle = ref("");
const API_URL = "/api/todos";

// Define the event that this component can emit to its parent
const emit = defineEmits(["todo-added"]);

const addTodo = async () => {
  if (!newTodoTitle.value.trim()) return;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodoTitle.value }),
    });
    if (!response.ok) throw new Error("Failed to create todo.");
    const newTodo = await response.json();

    // Emit the 'todo-added' event with the new todo data
    emit("todo-added", newTodo);

    newTodoTitle.value = "";
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.todo-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.todo-form input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.todo-form input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

.todo-form button {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: var(--accent-color);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.todo-form button:hover {
  background-color: var(--accent-hover);
}
</style>
