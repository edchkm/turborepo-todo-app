<template>
  <my-card>
    {{ todo.completed ? "✅" : "⏳" }}
    <p class="title">{{ todo.title }}</p>
    <p class="created-at">created at: {{ formatDate(todo.createdAt) }}</p>
  </my-card>
</template>

<script setup>
import { MyCard } from "@repo/vue-ui";
import { formatDate } from "@repo/date-utils";

defineProps({
  todo: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.created-at {
  font-size: 12px;
  color: #666;
}

.title {
  font-size: 16px;
  font-weight: bold;
}
</style>
