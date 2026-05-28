let counter = 0

export function generateId(prefix = 'id'): string {
  counter++
  return `${prefix}_${Date.now()}_${counter.toString(36)}`
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  if (isToday) return `${hours}:${minutes}`

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) return `昨天 ${hours}:${minutes}`

  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  if (date.getFullYear() === now.getFullYear()) {
    return `${month}/${day} ${hours}:${minutes}`
  }

  return `${date.getFullYear()}/${month}/${day}`
}

export function truncateText(text: string, maxLen = 20): string {
  const clean = text.replace(/\n/g, ' ').trim()
  if (clean.length <= maxLen) return clean
  return clean.slice(0, maxLen) + '...'
}

export function generateChatTitle(firstMessage: string): string {
  return truncateText(firstMessage, 25) || '新对话'
}
