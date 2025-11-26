import { reactive, watch, toRaw } from 'vue'

/**
 * PUBLIC_INTERFACE
 * useNotes
 * A small composable managing Notes CRUD with localStorage persistence,
 * filtering, sorting, debounce autosave, toasts, and UI flags.
 */
export function useNotes() {
  type Note = {
    id: string
    title: string
    content: string
    createdAt: number
    updatedAt: number
    pinned: boolean
  }

  const STORAGE_KEY = 'notes_app_v1'

  const state = reactive<{
    notes: Note[]
    activeId: string | null
  }>({
    notes: [],
    activeId: null,
  })

  // UI state
  const ui = reactive({
    search: '',
    sort: 'updatedAt_desc' as const,
    isLoading: true,
    saving: false,
    showDeleteConfirm: false,
    toasts: [] as { id: string; message: string; type?: 'success' | 'error' }[],
    previewMarkdown: false,
    get activeNote(): Note | null {
      return state.notes.find(n => n.id === state.activeId) ?? null
    },
    get filteredAndSorted(): Note[] {
      let list = [...state.notes]
      const q = ui.search.trim().toLowerCase()
      if (q) {
        list = list.filter(n =>
          n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
        )
      }
      // pinned first
      list.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        // updatedAt desc
        return b.updatedAt - a.updatedAt
      })
      return list
    },
  })

  // Helpers
  const uuid = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = uuid()
    ui.toasts.push({ id, message, type })
    setTimeout(() => {
      const i = ui.toasts.findIndex(t => t.id === id)
      if (i >= 0) ui.toasts.splice(i, 1)
    }, 1800)
  }

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toRaw(state.notes)))
    } catch {
      // ignore
    }
  }

  const loadFromStorage = () => {
    ui.isLoading = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const arr = JSON.parse(raw) as Note[]
        if (Array.isArray(arr)) {
          // simple migration: ensure fields exist
          state.notes = arr.map(n => ({
            id: n.id || uuid(),
            title: n.title || '',
            content: n.content || '',
            createdAt: n.createdAt || Date.now(),
            updatedAt: n.updatedAt || Date.now(),
            pinned: !!n.pinned,
          }))
        }
      } else {
        state.notes = []
      }
    } catch {
      state.notes = []
    } finally {
      ui.isLoading = false
    }
  }

  const actions = {
    createNote() {
      const now = Date.now()
      const n: Note = {
        id: uuid(),
        title: 'Untitled',
        content: '',
        createdAt: now,
        updatedAt: now,
        pinned: false,
      }
      state.notes.unshift(n)
      state.activeId = n.id
      persist()
      showToast('New note created', 'success')
    },
    setActive(id: string) {
      state.activeId = id
    },
    updateTitle(title: string) {
      const n = state.notes.find(n => n.id === state.activeId)
      if (!n) return
      n.title = title
      n.updatedAt = Date.now()
      scheduleSave()
    },
    updateContent(content: string) {
      const n = state.notes.find(n => n.id === state.activeId)
      if (!n) return
      n.content = content
      n.updatedAt = Date.now()
      scheduleSave()
    },
    togglePin(id: string) {
      const n = state.notes.find(n => n.id === id)
      if (!n) return
      n.pinned = !n.pinned
      n.updatedAt = Date.now()
      persist()
    },
    saveActive() {
      persist()
      ui.saving = false
      showToast('Saved', 'success')
    },
    deleteActive() {
      if (!state.activeId) return
      const idx = state.notes.findIndex(n => n.id === state.activeId)
      if (idx >= 0) {
        state.notes.splice(idx, 1)
        persist()
        showToast('Deleted', 'success')
      }
      state.activeId = state.notes[0]?.id ?? null
    },
  }

  // Debounce autosave
  let saveTimer: number | null = null
  const scheduleSave = () => {
    ui.saving = true
    if (saveTimer) window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => {
      actions.saveActive()
    }, 1000)
  }

  // Persist on any structural change
  watch(
    () => state.notes.map(n => ({ id: n.id, pinned: n.pinned })),
    persist,
    { deep: true },
  )

  return {
    state,
    ui,
    actions,
    loadFromStorage,
  }
}
