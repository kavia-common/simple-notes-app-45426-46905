<script lang="ts">
export default {
  name: 'AppToasts',
}
</script>

<script setup lang="ts">
/**
 * Toasts (multi-word component name is satisfied by explicit name).
 * Renders ephemeral toast messages teleported to body.
 */
defineProps<{
  toasts: { id: string; message: string; type?: 'success' | 'error' }[]
}>()
</script>

<template>
  <teleport to="body">
    <div class="toasts" aria-live="polite">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="t.type || 'success'"
        data-testid="toast"
        role="status"
      >
        {{ t.message }}
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 50;
}
.toast {
  background: #111827;
  color: #fff;
  padding: 10px 12px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  animation: slidein .2s ease;
}
.toast.success { background: #0f172a; }
.toast.error { background: #EF4444; }
@keyframes slidein {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
