const STORAGE_KEY = 'apex_trading_calendar_notes'



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
  
  }
  return notes
}
