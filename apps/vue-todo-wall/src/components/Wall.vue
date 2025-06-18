<template>
  <div class="wall">
    <WallItem v-for="todo in todos" :key="todo" :todo="todo" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import WallItem from "./WallItem.vue";

defineProps({
  todos: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.wall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
</style>
