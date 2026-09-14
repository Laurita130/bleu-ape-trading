
const MESSAGES_KEY = 'apex_trading_messages'

function getAllMessages() {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMessages(messages) {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail silently
  }
}

function involvesPair(message, a, b) {
  return (message.from === a && message.to === b) || (message.from === b && message.to === a)
}

export function getConversation(a, b) {
  return getAllMessages()
    .filter((message) => involvesPair(message, a, b))
    .sort((m1, m2) => m1.timestamp - m2.timestamp)
}


export function getConversationsFor(email) {
  const messages = getAllMessages().filter((message) => message.from === email || message.to === email)
  const partners = new Map()

  messages.forEach((message) => {
    const partnerEmail = message.from === email ? message.to : message.from
    const existing = partners.get(partnerEmail)
    if (!existing || message.timestamp > existing.lastMessage.timestamp) {
      partners.set(partnerEmail, { partnerEmail, lastMessage: message, unread: existing?.unread || 0 })
    }
  })

  messages.forEach((message) => {
    if (message.to === email && !message.read) {
      const entry = partners.get(message.from)
      if (entry) entry.unread += 1
    }
  })

  return Array.from(partners.values()).sort(
    (a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp
  )
}

export function sendMessage(from, to, text) {
  if (!text.trim()) return
  const messages = getAllMessages()
  messages.push({
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now()),
    from,
    to,
    text: text.trim(),
    timestamp: Date.now(),
    read: false,
  })
  saveMessages(messages)
}

export function markConversationRead(email, partnerEmail) {
  const messages = getAllMessages()
  let changed = false
  const updated = messages.map((message) => {
    if (message.to === email && message.from === partnerEmail && !message.read) {
      changed = true
      return { ...message, read: true }
    }
    return message
  })
  if (changed) saveMessages(updated)
}


export function hasUnread(email) {
  return getAllMessages().some((message) => message.to === email && !message.read)
}
