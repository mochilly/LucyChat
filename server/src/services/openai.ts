import { Response } from 'express'
import { config } from '../config/index.js'
import type { ChatMessage } from '../types/index.js'

export class OpenAIService {
  static async streamChat(
    messages: ChatMessage[],
    res: Response,
    signal?: AbortSignal
  ): Promise<void> {
    if (!config.apiKey) {
      res.status(500).json({ error: 'API_KEY is not configured on the server' })
      return
    }

    const response = await fetch(`${config.apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system' as const, content: config.systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 1.0,
        top_p: 0.95,
        max_tokens: 4096,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
      signal,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      res
        .status(response.status)
        .json({ error: `API error ${response.status}: ${errorText}` })
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      res.write('data: [DONE]\n\n')
      res.end()
      return
    }

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
        if (!trimmed) continue
        res.write(`${trimmed}\n\n`)
      }
    }

    if (buffer.trim()) {
      res.write(`${buffer.trim()}\n\n`)
    }

    res.write('data: [DONE]\n\n')
    res.end()
  }
}
