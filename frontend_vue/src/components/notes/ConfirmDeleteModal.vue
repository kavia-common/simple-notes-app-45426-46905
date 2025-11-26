<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'cancel'): void; (e: 'confirm'): void }>()
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="overlay" role="dialog" aria-modal="true" data-testid="delete-modal">
      <div class="modal">
        <h3>Delete this note?</h3>
        <p>This action cannot be undone.</p>
        <div class="actions">
          <button class="ghost" @click="emit('cancel')">Cancel</button>
          <button class="danger" data-testid="confirm-delete" @click="emit('confirm')">Delete</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(17,24,39,0.35);
  display: grid; place-items: center; z-index: 40;
}
.modal {
  background: #fff; border-radius: 14px; padding: 18px; width: 360px;
  box-shadow: 0 8px 24px rgba(16,24,40,0.2);
}
h3 { margin: 0 0 6px 0; color: #111827; }
p { margin: 0 0 16px 0; color: #6b7280; }
.actions { display: flex; justify-content: flex-end; gap: 8px; }
.ghost { background: transparent; border: 1px solid #e5e7eb; padding: 8px 10px; border-radius: 10px; }
.danger { background: #EF4444; color: #fff; border: none; padding: 8px 10px; border-radius: 10px; }
.danger:hover { background: #dc2626; }
</style>
