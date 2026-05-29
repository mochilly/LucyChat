import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.API_KEY || '',
  model: process.env.MODEL || 'gpt-5.5',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  systemPrompt:
    process.env.SYSTEM_PROMPT ||
    'You are MiMo, an AI assistant developed by Xiaomi. Be helpful, concise, and friendly. Respond in the same language as the user.',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
  },
}
