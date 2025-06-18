<template>
  <div class="container">
    <header>
      <h1>Todo List</h1>
    </header>
    <main>
      <TodoForm @todo-added="handleTodoAdded" />

      <div v-if="loading" class="loader-container">
        <div class="loader"></div>
      </div>

      <TodoList
        v-else
        :todos="todos"
        @toggle-todo="handleToggleTodo"
        @delete-todo="handleDeleteTodo"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TodoForm from "./components/TodoForm.vue";
import TodoList from "./components/TodoList.vue";

const todos = ref([]);
const loading = ref(true);
const API_URL = "/api/todos";

const fetchTodos = async () => {
  loading.value = true;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch todos.");
    todos.value = await response.json();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleTodoAdded = (newTodo) => {
  todos.value.unshift(newTodo);
};

const handleToggleTodo = (updatedTodo) => {
  const index = todos.value.findIndex((t) => t.id === updatedTodo.id);
  if (index !== -1) {
    todos.value[index].completed = updatedTodo.completed;
  }
};

const handleDeleteTodo = (todoId) => {
  todos.value = todos.value.filter((t) => t.id !== todoId);
};

onMounted(fetchTodos);
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

header {
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--primary-text);
}

header p {
  margin: 0.25rem 0 0;
  color: var(--secondary-text);
}

/* Loader Styles */
.loader-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.loader {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid var(--accent-color);
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
