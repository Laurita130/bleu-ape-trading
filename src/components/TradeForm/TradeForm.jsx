import { useState } from 'react'
import './TradeForm.css'

function TradeForm({ onAddTrade }) {
  const [ticker, setTicker] = useState('')
  const [pnl, setPnl] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(evt) {
    evt.preventDefault()
    if (!ticker.trim() || pnl === '') return

    onAddTrade({ ticker: ticker.trim(), pnl, notes: notes.trim() })
    setTicker('')
    setPnl('')
    setNotes('')
  }

  return (
    <form className="trade-form" onSubmit={handleSubmit}>
      <input
        className="trade-form__input"
        type="text"
        placeholder="Ticker (e.g. AAPL)"
        value={ticker}
        onChange={(evt) => setTicker(evt.target.value)}
        required
      />
      <input
        className="trade-form__input"
        type="number"
        step="0.01"
        placeholder="P&L ($)"
        value={pnl}
        onChange={(evt) => setPnl(evt.target.value)}
        required
      />
      <input
        className="trade-form__input trade-form__input_wide"
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(evt) => setNotes(evt.target.value)}
      />
      <button className="trade-form__submit" type="submit">
        Log trade
      </button>
    </form>
  )
}

export default TradeForm
