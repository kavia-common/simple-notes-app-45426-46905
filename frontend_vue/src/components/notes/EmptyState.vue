<script setup lang="ts">
const emit = defineEmits<{ (e: 'create'): void }>()
</script>

<template>
  <div class="empty" data-testid="empty-state">
    <div class="card">
      <h2>Welcome to Simple Notes</h2>
      <p>Create your first note to get started.</p>
      <button class="primary" @click="emit('create')">Create a note</button>
    </div>
  </div>
</template>

<style scoped>
.empty { height: 100%; display: grid; place-items: center; }
.card {
  text-align: center;
  background: #fff;
  padding: 28px 24px;
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(16,24,40,0.06);
}
h2 { margin: 0 0 6px 0; color: #111827; }
p { margin: 0 0 12px 0; color: #6b7280; }
.primary { background: #2563EB; color: #fff; border: none; padding: 10px 14px; border-radius: 10px; }
.primary:hover { background: #1d4ed8; }
</style>
