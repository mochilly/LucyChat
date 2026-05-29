import { Request, Response, NextFunction } from 'express'
import { config } from '../config/index.js'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const clients = new Map<string, RateLimitEntry>()

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of clients) {
    if (now > entry.resetAt) {
      clients.delete(key)
    }
  }
}, 60_000)

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const { windowMs, maxRequests } = config.rateLimit

  let entry = clients.get(ip)

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs }
    clients.set(ip, entry)
  }

  entry.count++

  res.setHeader('X-RateLimit-Limit', maxRequests)
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count))
  res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000))

  if (entry.count > maxRequests) {
    res.status(429).json({ error: 'Too many requests, please try again later' })
    return
  }

  next()
}
