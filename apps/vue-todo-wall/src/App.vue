<template>
  <div class="app">
    <h1>Wall of Todo</h1>

    <Wall :todos="todos" />
  </div>
</template>

<script setup>
import Wall from "./components/Wall.vue";
import { ref, onMounted } from "vue";

const todos = ref([]);

const fetchTodos = async () => {
  const response = await fetch("/api/todos");
  const data = await response.json();
  todos.value = data;
};

onMounted(fetchTodos);
</script>

<style scoped>
.app {
  padding: 20px;
}

h1 {
  text-align: center;
}
</style>
