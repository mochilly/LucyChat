import { Router, Request, Response } from 'express'
import { OpenAIService } from '../services/openai.js'
import type { ChatMessage } from '../types/index.js'

const router = Router()

router.post('/stream', async (req: Request, res: Response) => {
  const { messages } = req.body as { messages: ChatMessage[] }

  if (!Array.isArray(messages) || messages.length === 0) {
    res
      .status(400)
      .json({ error: 'messages is required and must be a non-empty array' })
    return
  }

  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      res
        .status(400)
        .json({ error: 'Each message must have role and content' })
      return
    }
    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      res
        .status(400)
        .json({ error: 'message role must be user, assistant, or system' })
      return
    }
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const controller = new AbortController()
  req.on('close', () => controller.abort())

  try {
    await OpenAIService.streamChat(messages, res, controller.signal)
  } catch (err: any) {
    if (err.name === 'AbortError') return
    console.error('[CHAT]', err.message)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    } else {
      res.end()
    }
  }
})

export default router
