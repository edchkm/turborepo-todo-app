<template>
  <div class="card">
    <div class="card-header">
      {{ todo.completed ? "✅" : "⏳" }}
      <p class="title">{{ todo.title }}</p>
      <p class="created-at">created at: {{ todo.createdAt }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  todo: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.created-at {
  font-size: 12px;
  color: #666;
}

.title {
  font-size: 16px;
  font-weight: bold;
}
</style>
