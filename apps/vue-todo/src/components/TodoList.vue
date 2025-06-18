<template>
  <ul class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle-todo="$emit('toggle-todo', $event)"
      @delete-todo="$emit('delete-todo', $event)"
    />
  </ul>
</template>

<script setup>
import TodoItem from "./TodoItem.vue";

// Define the props this component accepts from its parent
defineProps({
  todos: {
    type: Array,
    required: true,
  },
});

// Define the events this component can emit upwards
defineEmits(["toggle-todo", "delete-todo"]);
</script>

<style scoped>
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
