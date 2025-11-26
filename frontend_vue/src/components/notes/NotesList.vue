<script setup lang="ts">
import NoteListItem from './NoteListItem.vue'

type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  pinned: boolean
}

defineProps<{
  notes: Note[]
  activeId: string | null
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'toggle-pin', id: string): void
  (e: 'delete', id: string): void
  (e: 'new-note'): void
}>()
</script>

<template>
  <div class="list">
    <div class="list-header">
      <h2>Notes</h2>
      <button class="new" data-testid="list-new-btn" @click="emit('new-note')">+ New</button>
    </div>

    <div v-if="!notes.length" class="empty" data-testid="list-empty">No notes yet.</div>

    <ul class="items" role="list" aria-label="Notes list">
      <li v-for="n in notes" :key="n.id">
        <NoteListItem
          :note="n"
          :active="n.id === activeId"
          @select="emit('select', n.id)"
          @toggle-pin="emit('toggle-pin', n.id)"
          @delete="emit('delete', n.id)"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  border-bottom: 1px solid #eef2f7;
}
.list-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}
.new {
  background: #2563EB;
  color: #fff;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
}
.items {
  list-style: none;
  margin: 0;
  padding: 8px;
  overflow: auto;
  height: 100%;
}
.empty {
  padding: 18px;
  color: #6b7280;
}
</style>
