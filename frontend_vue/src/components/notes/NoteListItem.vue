<script setup lang="ts">
defineProps<{
  note: {
    id: string
    title: string
    content: string
    updatedAt: number
    pinned: boolean
  }
  active: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'toggle-pin'): void
  (e: 'delete'): void
}>()

const formatTime = (ts: number) => {
  const d = new Date(ts)
  return d.toLocaleString()
}
</script>

<template>
  <article
    class="item"
    :class="{ active }"
    @click="emit('select')"
    :data-testid="active ? 'note-item-active' : 'note-item'"
  >
    <div class="row">
      <h3 class="title">
        <span v-if="note.pinned" class="pin" aria-label="Pinned">📌</span>
        {{ note.title || 'Untitled' }}
      </h3>
      <div class="actions" @click.stop>
        <button class="icon" :title="note.pinned ? 'Unpin' : 'Pin'" @click="emit('toggle-pin')">📌</button>
        <button class="icon danger" title="Delete" @click="emit('delete')">🗑️</button>
      </div>
    </div>
    <p class="preview">{{ note.content?.slice(0, 80) }}</p>
    <div class="meta">Updated {{ formatTime(note.updatedAt) }}</div>
  </article>
</template>

<style scoped>
.item {
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 10px;
  margin: 8px 4px;
  transition: box-shadow .2s ease, transform .05s ease, border-color .2s ease, background-color .2s ease;
  background: #fff;
}
.item:hover {
  box-shadow: 0 2px 4px rgba(16,24,40,0.08);
  border-color: #e5e7eb;
}
.item.active {
  border-color: #2563EB;
  background: #f7faff;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15) inset;
}
.row {
  display: flex; align-items: center; justify-content: space-between;
}
.title {
  font-size: 14px; font-weight: 600; color: #1f2937;
  display: flex; align-items: center; gap: 6px;
}
.pin { font-size: 14px }
.preview {
  color: #6b7280; margin: 6px 0 0 0; font-size: 12px;
}
.meta {
  margin-top: 6px; color: #9ca3af; font-size: 11px;
}
.actions { display: flex; gap: 6px; }
.icon {
  border: none; background: transparent; padding: 4px 6px; border-radius: 8px;
}
.icon:hover { background: #f3f4f6; }
.icon.danger:hover { background: #fee2e2; }
</style>
