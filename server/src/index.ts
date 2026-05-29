import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import chatRouter from './routes/chat.js'
import { errorHandler } from './middleware/errorHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { requestLogger } from './utils/logger.js'

const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())
app.use(requestLogger)
app.use('/api/chat', rateLimiter)
app.use('/api/chat', chatRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
})
