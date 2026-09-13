import { useEffect, useState } from 'react'
import { computeJournalStats } from '../../utils/trades.js'
import { getActiveMs, formatDuration } from '../../utils/sessionTime.js'
import './JournalStats.css'

function pnlClass(value) {
  if (value > 0) return 'journal-stats__value_positive'
  if (value < 0) return 'journal-stats__value_negative'
  return ''
}

function formatCurrency(value) {
  const sign = value > 0 ? '+' : ''
  return `${sign}$${value.toFixed(2)}`
}

// Recomputes every stat fresh from `trades` on each render — nothing here
// is manually entered, it all updates automatically as trades are logged.
function JournalStats({ trades }) {
  const stats = computeJournalStats(trades)
  const [elapsedMs, setElapsedMs] = useState(() => getActiveMs())

  useEffect(() => {
    const timer = setInterval(() => setElapsedMs(getActiveMs()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="journal-stats">
      {stats.totalTrades === 0 ? (
        <div className="journal-stats__tile journal-stats__tile_wide">
          <p className="journal-stats__label">Stats</p>
          <p className="journal-stats__empty-text">
            Log a few trades and your stats — win rate, average win/loss, best and worst trade —
            will show up here automatically.
          </p>
        </div>
      ) : (
        <>
          <div className="journal-stats__tile">
            <p className="journal-stats__label">Total P&amp;L</p>
            <p className={`journal-stats__value ${pnlClass(stats.totalPnl)}`}>
              {formatCurrency(stats.totalPnl)}
            </p>
          </div>
          <div className="journal-stats__tile">
            <p className="journal-stats__label">Total Trades</p>
            <p className="journal-stats__value">{stats.totalTrades}</p>
          </div>
          <div className="journal-stats__tile">
            <p className="journal-stats__label">Win Rate</p>
            <p className="journal-stats__value">{stats.winRate.toFixed(0)}%</p>
          </div>
          <div className="journal-stats__tile">
            <p className="journal-stats__label">Wins / Losses</p>
            <p className="journal-stats__value">
              <span className="journal-stats__value_positive">{stats.wins}</span>
              {' / '}
              <span className="journal-stats__value_negative">{stats.losses}</span>
            </p>
          </div>
          <div className="journal-stats__tile">
            <p className="journal-stats__label">Avg Win</p>
            <p className={`journal-stats__value ${pnlClass(stats.avgWin)}`}>
              {stats.wins > 0 ? formatCurrency(stats.avgWin) : '—'}
            </p>
          </div>
          <div className="journal-stats__tile">
            <p className="journal-stats__label">Avg Loss</p>
            <p className={`journal-stats__value ${pnlClass(stats.avgLoss)}`}>
              {stats.losses > 0 ? formatCurrency(stats.avgLoss) : '—'}
            </p>
          </div>
          <div className="journal-stats__tile">
            <p className="journal-stats__label">Best Trade</p>
            <p className={`journal-stats__value ${stats.best ? pnlClass(stats.best.pnl) : ''}`}>
              {stats.best ? `${stats.best.ticker} ${formatCurrency(stats.best.pnl)}` : '—'}
            </p>
          </div>
          <div className="journal-stats__tile">
            <p className="journal-stats__label">Worst Trade</p>
            <p className={`journal-stats__value ${stats.worst ? pnlClass(stats.worst.pnl) : ''}`}>
              {stats.worst ? `${stats.worst.ticker} ${formatCurrency(stats.worst.pnl)}` : '—'}
            </p>
          </div>
        </>
      )}

      <div className="journal-stats__tile">
        <p className="journal-stats__label">Time On App</p>
        <p className="journal-stats__value">{formatDuration(elapsedMs)}</p>
        <p className="journal-stats__quote">— time invested in your future</p>
      </div>
    </section>
  )
}

export default JournalStats
