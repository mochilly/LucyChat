export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface StreamCallbacks {
  onToken: (token: string) => void
  onComplete: () => void
  onError: (error: Error) => void
}

export interface ChatStreamRequest {
  messages: ChatMessage[]
}

export interface OpenAIStreamParams {
  messages: ChatMessage[]
  model: string
  temperature: number
  topP: number
  maxTokens: number
  frequencyPenalty: number
  presencePenalty: number
}
