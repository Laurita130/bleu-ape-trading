import './TradeRow.css'

function formatDisplayDate(isoDate) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${month}-${day}-${year}`
}

function TradeRow({ trade, onDelete }) {
  const isProfit = trade.pnl >= 0

  return (
    <div className="trade-row">
      <span className="trade-row__date">{formatDisplayDate(trade.date)}</span>
      <span className="trade-row__ticker">{trade.ticker}</span>
      <span
        className={`trade-row__pnl${isProfit ? ' trade-row__pnl_positive' : ' trade-row__pnl_negative'}`}
      >
        {isProfit ? '+' : ''}
        {Number(trade.pnl).toFixed(2)}
      </span>
      <span className="trade-row__notes">{trade.notes}</span>
      <button
        className="trade-row__delete"
        type="button"
        onClick={onDelete}
        aria-label="Delete trade"
      >
        ✕
      </button>
    </div>
  )
}

export default TradeRow
