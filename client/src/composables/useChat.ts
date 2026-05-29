import { ref, nextTick } from 'vue'
import { useChatStore } from '../stores/chat'
import { generateId } from '../utils/format'
import { createChatStream } from '../api/chat'

export function useChat() {
  const store = useChatStore()
  const userInput = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let abortFn: (() => void) | null = null

  async function sendMessage(text?: string) {
    const content = (text ?? userInput.value).trim()
    if (!content || isLoading.value) return

    let sessionId = store.activeSessionId
    if (!sessionId) {
      sessionId = store.createSession()
    }

    const userMessage = {
      id: generateId('msg'),
      role: 'user' as const,
      content,
      timestamp: Date.now(),
    }
    store.addMessage(sessionId, userMessage)

    const assistantMessage = {
      id: generateId('msg'),
      role: 'assistant' as const,
      content: '',
      timestamp: Date.now(),
    }
    store.addMessage(sessionId, assistantMessage)

    userInput.value = ''
    isLoading.value = true
    error.value = null
    store.isStreaming = true

    const historyMessages = store.activeSession!.messages
      .filter((m) => m.role !== 'system')
      .slice(0, -1)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    let completed = false

    abortFn = createChatStream(historyMessages, {
      onToken(token) {
        if (!completed) {
          store.appendToLastAssistantMessage(sessionId!, token)
        }
      },
      onComplete() {
        completed = true
        isLoading.value = false
        store.isStreaming = false
        abortFn = null
      },
      onError(err) {
        completed = true
        error.value = err.message
        store.updateLastAssistantMessage(
          sessionId!,
          `抱歉，发生了错误：${err.message}`
        )
        isLoading.value = false
        store.isStreaming = false
        abortFn = null
      },
    })
  }

  function stopGeneration() {
    if (abortFn) {
      abortFn()
      abortFn = null
    }
    isLoading.value = false
    store.isStreaming = false
  }

  return {
    userInput,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
  }
}
