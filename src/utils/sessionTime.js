// Tracks total time the user has spent logged into the app. Unlike a plain
// wall-clock diff, this uses an accumulator: time only counts up while a
// "segment" is open (started on login, closed on logout), so the clock
// pauses the moment the user logs out instead of continuing to run in the
// background.
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

// Call when the user logs in. Safe to call more than once — if a segment is
// already open (e.g. a stray call on remount) it won't reset the clock.
export function startActiveSegment() {
  try {
    if (!localStorage.getItem(SEGMENT_START_KEY)) {
      localStorage.setItem(SEGMENT_START_KEY, String(Date.now()))
    }
  } catch {
    // localStorage can throw in private-browsing mode — fail soft
  }
}

// Call when the user logs out (or the tab is closing). Folds the open
// segment's elapsed time into the running total and closes the segment.
export function stopActiveSegment() {
  try {
    const segmentStart = readSegmentStart()
    if (segmentStart) {
      const total = readStoredMs() + (Date.now() - segmentStart)
      localStorage.setItem(ACTIVE_MS_KEY, String(total))
      localStorage.removeItem(SEGMENT_START_KEY)
    }
  } catch {
    // localStorage can throw in private-browsing mode — fail soft
  }
}

// Total active time so far: the banked total, plus whatever has elapsed in
// the currently-open segment (if the user is logged in right now).
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
