import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ChatSession, Message, ChatStore } from '../types'
import { generateId, generateChatTitle } from '../utils/format'
import { loadStore, scheduleSave } from '../utils/storage'

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([])
  const activeSessionId = ref<string | null>(null)
  const isStreaming = ref(false)

  const activeSession = computed(() =>
    sessions.value.find((s) => s.id === activeSessionId.value) || null
  )

  const sortedSessions = computed(() =>
    [...sessions.value].sort((a, b) => b.updatedAt - a.updatedAt)
  )

  function initState() {
    const saved = loadStore()
    if (saved) {
      sessions.value = saved.sessions
      activeSessionId.value = saved.activeSessionId
    }
  }

  function persist() {
    const storeData: ChatStore = {
      version: 1,
      activeSessionId: activeSessionId.value,
      sessions: sessions.value,
    }
    scheduleSave(storeData)
  }

  watch([sessions, activeSessionId], persist, { deep: true })

  function createSession(): string {
    const session: ChatSession = {
      id: generateId('chat'),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    sessions.value.unshift(session)
    activeSessionId.value = session.id
    return session.id
  }

  function deleteSession(id: string) {
    const index = sessions.value.findIndex((s) => s.id === id)
    if (index === -1) return

    sessions.value.splice(index, 1)

    if (activeSessionId.value === id) {
      activeSessionId.value =
        sessions.value.length > 0 ? sessions.value[0].id : null
    }
  }

  function renameSession(id: string, title: string) {
    const session = sessions.value.find((s) => s.id === id)
    if (session) {
      session.title = title
      session.updatedAt = Date.now()
    }
  }

  function selectSession(id: string) {
    activeSessionId.value = id
  }

  function addMessage(sessionId: string, message: Message) {
    const session = sessions.value.find((s) => s.id === sessionId)
    if (!session) return

    session.messages.push(message)
    session.updatedAt = Date.now()

    if (
      message.role === 'user' &&
      session.messages.filter((m) => m.role === 'user').length === 1
    ) {
      session.title = generateChatTitle(message.content)
    }
  }

  function updateLastAssistantMessage(
    sessionId: string,
    content: string
  ) {
    const session = sessions.value.find((s) => s.id === sessionId)
    if (!session) return

    const lastMsg = [...session.messages]
      .reverse()
      .find((m) => m.role === 'assistant')
    if (lastMsg) {
      lastMsg.content = content
      session.updatedAt = Date.now()
    }
  }

  function appendToLastAssistantMessage(
    sessionId: string,
    token: string
  ) {
    const session = sessions.value.find((s) => s.id === sessionId)
    if (!session) return

    const lastMsg = [...session.messages]
      .reverse()
      .find((m) => m.role === 'assistant')
    if (lastMsg) {
      lastMsg.content += token
      session.updatedAt = Date.now()
    }
  }

  return {
    sessions,
    activeSessionId,
    activeSession,
    sortedSessions,
    isStreaming,
    initState,
    createSession,
    deleteSession,
    renameSession,
    selectSession,
    addMessage,
    updateLastAssistantMessage,
    appendToLastAssistantMessage,
  }
})
