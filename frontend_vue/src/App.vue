<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import HeaderBar from './components/notes/HeaderBar.vue'
import NotesList from './components/notes/NotesList.vue'
import NoteEditor from './components/notes/NoteEditor.vue'
import EmptyState from './components/notes/EmptyState.vue'
import ConfirmDeleteModal from './components/notes/ConfirmDeleteModal.vue'
import Toasts from './components/notes/Toasts.vue'
import { useNotes } from './composables/useNotes'

// init store/composable
const {
  state,
  ui,
  actions,
  loadFromStorage,
} = useNotes()

// keyboard shortcuts
function onKey(e: KeyboardEvent) {
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
  const mod = isMac ? e.metaKey : e.ctrlKey

  if (mod && e.key.toLowerCase() === 'n') {
    e.preventDefault()
    actions.createNote()
  } else if (mod && e.key.toLowerCase() === 's') {
    e.preventDefault()
    actions.saveActive()
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    if (state.activeId) {
      e.preventDefault()
      ui.showDeleteConfirm = true
    }
  }
}

onMounted(() => {
  loadFromStorage()
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="app-shell" data-testid="app-shell">
    <HeaderBar
      :search="ui.search"
      :sort="ui.sort"
      :is-loading="ui.isLoading"
      @update:search="ui.search = $event"
      @update:sort="ui.sort = $event"
      @new-note="actions.createNote"
    />

    <div class="content">
      <aside class="sidebar" data-testid="notes-list">
        <NotesList
          :notes="ui.filteredAndSorted"
          :active-id="state.activeId"
          @select="actions.setActive"
          @toggle-pin="actions.togglePin"
          @delete="(id) => { actions.setActive(id); ui.showDeleteConfirm = true }"
          @new-note="actions.createNote"
        />
      </aside>

      <main class="editor" data-testid="note-editor">
        <transition name="fade">
          <NoteEditor
            v-if="ui.activeNote"
            :note="ui.activeNote"
            :saving="ui.saving"
            @update:title="actions.updateTitle"
            @update:content="actions.updateContent"
            @save="actions.saveActive"
          />
          <EmptyState v-else @create="actions.createNote" />
        </transition>
      </main>
    </div>

    <ConfirmDeleteModal
      :open="ui.showDeleteConfirm"
      @cancel="ui.showDeleteConfirm = false"
      @confirm="() => { actions.deleteActive(); ui.showDeleteConfirm = false }"
    />

    <Toasts :toasts="ui.toasts" />
  </div>
</template>

<style scoped>
/* Ocean Professional Theme Tokens */
:root {
  --op-primary: #2563EB;
  --op-secondary: #F59E0B;
  --op-error: #EF4444;
  --op-bg: #f9fafb;
  --op-surface: #ffffff;
  --op-text: #111827;
  --op-ring: 0 0 0 3px rgba(37, 99, 235, 0.35);
}

.app-shell {
  min-height: 100vh;
  background: var(--op-bg);
  color: var(--op-text);
  display: flex;
  flex-direction: column;
}

.content {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  padding: 16px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 24px auto;
}

.sidebar, .editor {
  background: var(--op-surface);
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04);
  overflow: hidden;
  min-height: calc(100vh - 160px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(4px); }

@media (max-width: 960px) {
  .content {
    grid-template-columns: 1fr;
  }
  .sidebar { min-height: auto; }
  .editor { min-height: 60vh; }
}
</style>
