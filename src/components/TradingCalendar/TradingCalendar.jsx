import { useMemo, useState } from 'react'
import ModalWithForm from '../ModalWithForm/ModalWithForm.jsx'
import { getNotes, setNote } from '../../utils/calendarNotes.js'
import './TradingCalendar.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function formatDateLabel(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// A click-to-edit monthly calendar. Days with a logged trade get a colored
// background; a short preview of that day's note (if any) shows right on the
// cell, and clicking any day opens a popup to read/write the note and log
// that day's P&L — which is saved straight into the Journal, so it doesn't
// have to be entered twice.
function TradingCalendar({ trades, onSaveCalendarEntry }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [openDate, setOpenDate] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [pnlDraft, setPnlDraft] = useState('')
  const [notes, setNotesState] = useState(() => getNotes())

  const tradeDatesSet = useMemo(() => {
    const set = new Set()
    trades.forEach((trade) => {
      if (trade.date) set.add(trade.date.slice(0, 10))
    })
    return set
  }, [trades])

  const calendarPnlByDate = useMemo(() => {
    const map = new Map()
    trades.forEach((trade) => {
      if (trade.date && trade.source === 'calendar') map.set(trade.date, trade.pnl)
    })
    return map
  }, [trades])

  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((year) => year - 1)
    } else {
      setViewMonth((month) => month - 1)
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((year) => year + 1)
    } else {
      setViewMonth((month) => month + 1)
    }
  }

  function handleOpenDay(day) {
    const dateKey = toDateKey(viewYear, viewMonth, day)
    setOpenDate(dateKey)
    setNoteDraft(notes[dateKey] || '')
    const existingPnl = calendarPnlByDate.get(dateKey)
    setPnlDraft(existingPnl === undefined ? '' : String(existingPnl))
  }

  function handleCloseModal() {
    setOpenDate(null)
  }

  function handleSaveNote() {
    if (!openDate) return
    setNotesState(setNote(openDate, noteDraft))
    onSaveCalendarEntry?.(openDate, pnlDraft, noteDraft)
    setOpenDate(null)
  }

  const monthLabel = firstOfMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <section className="trading-calendar">
      <div className="trading-calendar__header">
        <button
          type="button"
          className="trading-calendar__nav"
          onClick={goPrevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="trading-calendar__month">{monthLabel}</h3>
        <button
          type="button"
          className="trading-calendar__nav"
          onClick={goNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="trading-calendar__weekdays">
        {WEEKDAYS.map((label) => (
          <span key={label} className="trading-calendar__weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="trading-calendar__grid">
        {cells.map((day, index) => {
          if (day === null) {
            return <span key={`empty-${index}`} className="trading-calendar__cell trading-calendar__cell_empty" />
          }
          const dateKey = toDateKey(viewYear, viewMonth, day)
          const isTradingDay = tradeDatesSet.has(dateKey)
          const isToday = dateKey === todayKey
          const note = notes[dateKey]

          return (
            <button
              type="button"
              key={dateKey}
              className={`trading-calendar__cell${isTradingDay ? ' trading-calendar__cell_traded' : ''}${
                isToday ? ' trading-calendar__cell_today' : ''
              }`}
              onClick={() => handleOpenDay(day)}
            >
              <span className="trading-calendar__cell-day">{day}</span>
              {note && <span className="trading-calendar__cell-preview">{note}</span>}
            </button>
          )
        })}
      </div>

      <ModalWithForm
        isOpen={Boolean(openDate)}
        onClose={handleCloseModal}
        title={openDate ? formatDateLabel(openDate) : ''}
        buttonText="Save"
        onSubmit={handleSaveNote}
      >
        <label className="modal__label" htmlFor="calendar-pnl">
          P&amp;L for this day ($)
          <input
            id="calendar-pnl"
            className="modal__input"
            type="number"
            step="0.01"
            placeholder="e.g. 150 or -75"
            value={pnlDraft}
            onChange={(evt) => setPnlDraft(evt.target.value)}
          />
          <span className="modal__hint">
            Leave blank for no P&amp;L — filling this in logs it to your Journal automatically
          </span>
        </label>
        <label className="modal__label" htmlFor="calendar-note">
          Note
          <textarea
            id="calendar-note"
            className="modal__input trading-calendar__note-textarea"
            rows={6}
            value={noteDraft}
            onChange={(evt) => setNoteDraft(evt.target.value)}
            placeholder="What happened in the market today? Any setups to remember?"
          />
        </label>
      </ModalWithForm>
    </section>
  )
}

export default TradingCalendar
