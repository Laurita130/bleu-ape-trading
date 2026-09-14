
const ACTIVE_MS_KEY = 'apex_trading_active_ms'
const SEGMENT_START_KEY = 'apex_trading_active_segment_start'

function readStoredMs() {
  try {
    const raw = localStorage.getItem(ACTIVE_MS_KEY)
    const parsed = raw ? Number(raw) : 0
    return Number.isFinite(parsed) ? parsed : 0
  } catch {
    return 0
  }
}

function readSegmentStart() {
  try {
    const raw = localStorage.getItem(SEGMENT_START_KEY)
    return raw ? Number(raw) : null
  } catch {
    return null
  }
}


export function startActiveSegment() {
  try {
    if (!localStorage.getItem(SEGMENT_START_KEY)) {
      localStorage.setItem(SEGMENT_START_KEY, String(Date.now()))
    }
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail silently
  }
}

export function stopActiveSegment() {
  try {
    const segmentStart = readSegmentStart()
    if (segmentStart) {
      const total = readStoredMs() + (Date.now() - segmentStart)
      localStorage.setItem(ACTIVE_MS_KEY, String(total))
      localStorage.removeItem(SEGMENT_START_KEY)
    }
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail silently
  }
}


export function getActiveMs() {
  const segmentStart = readSegmentStart()
  const stored = readStoredMs()
  if (segmentStart) {
    return stored + (Date.now() - segmentStart)
  }
  return stored
}

export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}
