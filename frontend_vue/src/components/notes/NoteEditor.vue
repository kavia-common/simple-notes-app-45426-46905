<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  note: {
    id: string
    title: string
    content: string
    updatedAt: number
  }
  saving: boolean
}>()

const emit = defineEmits<{
  (e: 'update:title', v: string): void
  (e: 'update:content', v: string): void
  (e: 'save'): void
}>()

const title = ref(props.note.title)
const content = ref(props.note.content)
const preview = ref(false)

watch(
  () => props.note.id,
  () => {
    title.value = props.note.title
    content.value = props.note.content
  },
)

watch(title, v => emit('update:title', v))
watch(content, v => emit('update:content', v))

const rendered = computed(() => {
  // very lightweight markdown: only headings, bold, italics, code blocks, links
  let t = content.value || ''
  t = t
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\n$/gim, '<br/>')
  return t
})
</script>

<template>
  <section class="wrap">
    <div class="toolbar">
      <div class="left">
        <input
          class="title"
          data-testid="editor-title"
          type="text"
          :value="title"
          @input="title = ($event.target as HTMLInputElement).value"
          placeholder="Title"
        />
      </div>
      <div class="right">
        <span class="saving" aria-live="polite">
          <template v-if="saving">Saving…</template>
          <template v-else>Saved</template>
        </span>
        <button class="ghost" data-testid="toggle-preview" @click="preview = !preview">
          {{ preview ? 'Edit' : 'Preview' }}
        </button>
        <button class="primary" data-testid="save-btn" @click="$emit('save')" title="Save (Ctrl/Cmd + S)">
          Save
        </button>
      </div>
    </div>

    <div class="editor-area">
      <textarea
        v-if="!preview"
        class="content"
        data-testid="editor-content"
        :value="content"
        @input="content = ($event.target as HTMLTextAreaElement).value"
        placeholder="Write your notes in plain text or basic markdown..."
      />
      <div v-else class="preview" data-testid="markdown-preview" v-html="rendered"></div>
    </div>
  </section>
</template>

<style scoped>
.wrap { display: flex; flex-direction: column; height: 100%; }
.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px; border-bottom: 1px solid #eef2f7;
}
.title {
  font-size: 18px; font-weight: 600; border: 1px solid #e5e7eb; padding: 8px 10px; border-radius: 10px; width: 420px;
}
.title:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.25); outline: none; }
.right { display: flex; align-items: center; gap: 10px; }
.saving { font-size: 12px; color: #6b7280; }
.ghost {
  background: transparent; border: 1px solid #e5e7eb; color: #111827; padding: 8px 10px; border-radius: 10px;
}
.ghost:hover { background: #f9fafb; }
.primary { background: #2563EB; color: #fff; border: none; padding: 8px 12px; border-radius: 10px; }
.primary:hover { background: #1d4ed8; }

.editor-area { flex: 1; display: grid; }
.content {
  border: none; padding: 14px; resize: none; outline: none; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.preview {
  padding: 14px; overflow: auto;
}
.preview :where(h1,h2,h3,h4,h5,h6) { margin: 8px 0; }
.preview a { color: #2563EB; }
.preview code { background: #f3f4f6; padding: 2px 4px; border-radius: 6px; }
</style>
