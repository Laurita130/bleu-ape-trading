
const SEEN_KEY = 'apex_trading_seen_announcements'

function getSeenMap() {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveSeenMap(map) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(map))
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

export function markAnnouncementsSeen(email) {
  if (!email) return
  const map = getSeenMap()
  map[email] = ANNOUNCEMENTS.map((announcement) => announcement.id)
  saveSeenMap(map)
}

export function hasUnseenAnnouncements(email) {
  if (!email) return false
  const seenIds = getSeenMap()[email] || []
  return ANNOUNCEMENTS.some((announcement) => !seenIds.includes(announcement.id))
}


export const ANNOUNCEMENTS = [
  {
    id: 'community-launch',
    title: 'The Nest is live!',
    date: '2026-09-13',
    body: 'Add friends, get recommendations, and message other traders right here in The Nest.',
  },
  {
    id: 'live-session-dominik',
    title: 'Live learning session with Dominik Lysaght',
    date: '2026-09-20',
    body: 'Join the next live trading session covering risk management and position sizing.',
  },
  {
    id: 'options-course-launch',
    title: 'New options trading course dropping soon',
    date: '2026-09-25',
    body: 'A full options-trading course is coming to the Courses tab — covers, spreads, and Greeks explained simply.',
  },
]
