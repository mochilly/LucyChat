// API 基础地址，可通过环境变量 VITE_API_BASE_URL 覆盖
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1'
// API 密钥，可通过环境变量 VITE_API_KEY 覆盖
const API_KEY = import.meta.env.VITE_API_KEY || 'sk-proj-aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abcdefg'
// 模型名称，可通过环境变量 VITE_MODEL 覆盖
const DEFAULT_MODEL = import.meta.env.VITE_MODEL || 'gpt-5.5'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface StreamCallbacks {
  onToken: (token: string) => void
  onComplete: () => void
  onError: (error: Error) => void
}

export function createChatStream(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): () => void {
  const controller = new AbortController()
  const combinedSignal = signal
    ? combineAbortSignals(signal, controller.signal)
    : controller.signal

  let aborted = false

  const run = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are MiMo, an AI assistant developed by Xiaomi. Be helpful, concise, and friendly. Respond in the same language as the user.',
            },
            ...messages,
          ],
          stream: true,
          temperature: 1.0,
          top_p: 0.95,
          max_tokens: 4096,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
        signal: combinedSignal,
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`API error ${response.status}: ${errorText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          const data = trimmed.slice(6)
          if (data === '[DONE]') {
            callbacks.onComplete()
            return
          }

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              callbacks.onToken(content)
            }
          } catch {
            // skip malformed JSON
          }
        }
      }

      if (!aborted) {
        callbacks.onComplete()
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || aborted) {
        callbacks.onComplete()
        return
      }
      callbacks.onError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  run()

  return () => {
    aborted = true
    controller.abort()
  }
}

function combineAbortSignals(
  signal1: AbortSignal,
  signal2: AbortSignal
): AbortSignal {
  const controller = new AbortController()

  const onAbort = () => controller.abort()

  if (signal1.aborted || signal2.aborted) {
    controller.abort()
    return controller.signal
  }

  signal1.addEventListener('abort', onAbort, { once: true })
  signal2.addEventListener('abort', onAbort, { once: true })

  return controller.signal
}
