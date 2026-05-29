import type { ChatStore } from '../types'

const STORAGE_KEY = 'lucychat_data'
const MAX_STORAGE_BYTES = 4 * 1024 * 1024

export function loadStore(): ChatStore | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as ChatStore
    if (data.version !== 1) return null
    return data
  } catch {
    return null
  }
}

export function saveStore(data: ChatStore): boolean {
  try {
    const raw = JSON.stringify(data)
    if (new Blob([raw]).size > MAX_STORAGE_BYTES) {
      return false
    }
    localStorage.setItem(STORAGE_KEY, raw)
    return true
  } catch {
    return false
  }
}

let saveTimer: ReturnType<typeof requestAnimationFrame> | null = null
let pendingData: ChatStore | null = null

export function scheduleSave(data: ChatStore): void {
  pendingData = data
  if (saveTimer !== null) return
  saveTimer = requestAnimationFrame(() => {
    saveTimer = null
    if (pendingData) {
      saveStore(pendingData)
      pendingData = null
    }
  })
}
