<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <p class="title" @click="toggle">
      {{ todo.title }}
    </p>
    <p class="created-at">{{ createdAt(todo.createdAt) }}</p>
    <button @click="remove" class="delete-btn">&times;</button>
  </li>
</template>

<script setup>
// Define props and emits
const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["toggle-todo", "delete-todo"]);

const createdAt = (createdAt) => {
  return new Date(createdAt).toLocaleString();
};

const API_URL = "/api/todos";

const toggle = async () => {
  try {
    const response = await fetch(`${API_URL}/${props.todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !props.todo.completed }),
    });
    if (!response.ok) throw new Error("Failed to update todo.");
    const updatedTodo = await response.json();
    emit("toggle-todo", updatedTodo);
  } catch (error) {
    console.error(error);
  }
};

const remove = async () => {
  if (!confirm("Are you sure you want to delete this todo?")) return;
  try {
    const response = await fetch(`${API_URL}/${props.todo.id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo.");
    emit("delete-todo", props.todo.id);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
  transition:
    background-color 0.2s,
    opacity 0.3s;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background-color: #f8fafc;
}

.todo-item .title {
  flex-grow: 1;
  margin-left: 0.75rem;
  cursor: pointer;
  font-size: 1.1rem;
  transition:
    color 0.3s,
    text-decoration 0.3s;
}

.todo-item.completed .title {
  text-decoration: line-through;
  color: var(--secondary-text);
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--secondary-text);
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.delete-btn:hover {
  color: var(--danger-color);
  background-color: #fee;
}

.created-at {
  font-size: 12px;
  color: #666;
}
</style>
