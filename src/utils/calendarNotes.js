const STORAGE_KEY = 'apex_trading_calendar_notes'

// Notes are stored as { "2026-09-12": "note text", ... } keyed by day.

export function getNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setNote(dateKey, text) {
  const notes = getNotes()
  if (text.trim()) {
    notes[dateKey] = text
  } else {
    delete notes[dateKey]
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
  return notes
}
