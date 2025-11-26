<script setup lang="ts">
/**
 * HeaderBar shows app title, global search, sort snapshot, and create button.
 */
defineProps<{
  search: string
  sort: 'updatedAt_desc'
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:search', v: string): void
  (e: 'update:sort', v: 'updatedAt_desc'): void
  (e: 'new-note'): void
}>()
</script>

<template>
  <header
    class="header"
    role="banner"
    :aria-busy="isLoading ? 'true' : 'false'"
    data-testid="header"
  >
    <div class="inner">
      <div class="title-wrap">
        <h1 class="title">Simple Notes</h1>
        <p class="subtitle">Modern, fast, and local.</p>
      </div>

      <div class="actions">
        <div class="search-wrap">
          <input
            data-testid="search-input"
            :value="search"
            @input="emit('update:search', ($event.target as HTMLInputElement).value)"
            type="search"
            placeholder="Search notes..."
            aria-label="Search notes"
          />
        </div>

        <button
          class="primary"
          data-testid="new-note-btn"
          @click="emit('new-note')"
          title="New (Ctrl/Cmd + N)"
        >
          + New
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, rgba(37,99,235,0.08), rgba(249,250,251,1));
  border-bottom: 1px solid rgba(17,24,39,0.06);
}
.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title-wrap .title {
  margin: 0;
  font-size: 20px;
  color: #111827;
}
.subtitle {
  margin: 2px 0 0 0;
  color: #6b7280;
  font-size: 12px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.search-wrap input {
  width: 260px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  transition: box-shadow .2s ease, border-color .2s ease;
  background: #fff;
}
.search-wrap input:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
  outline: none;
}
.primary {
  background: #2563EB;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  transition: transform .05s ease, box-shadow .2s ease, background-color .2s ease;
  box-shadow: 0 1px 2px rgba(16,24,40,0.16);
}
.primary:hover { background: #1d4ed8; }
.primary:active { transform: translateY(1px); }
@media (max-width: 640px) {
  .inner { flex-direction: column; align-items: stretch; gap: 10px; }
  .actions { width: 100%; }
  .search-wrap input { width: 100%; }
}
</style>
