import TradeForm from '../../components/TradeForm/TradeForm.jsx'
import TradeRow from '../../components/TradeRow/TradeRow.jsx'
import JournalStats from '../../components/JournalStats/JournalStats.jsx'
import MonthlyGoalMeter from '../../components/MonthlyGoalMeter/MonthlyGoalMeter.jsx'
import BinaryRainBackground from '../../components/BinaryRainBackground/BinaryRainBackground.jsx'
import './Journal.css'

function Journal({ trades, onAddTrade, onDeleteTrade }) {
  return (
    <section className="journal">
      <BinaryRainBackground />
      <div className="journal__content">
        <h1 className="journal__title">Trade Journal</h1>

        <TradeForm onAddTrade={onAddTrade} />

        <MonthlyGoalMeter trades={trades} />

        <JournalStats trades={trades} />

        <div className="journal__list">
          {trades.length === 0 && (
            <p className="journal__empty">No trades logged yet — add your first one above.</p>
          )}
          {trades.map((trade) => (
            <TradeRow key={trade.id} trade={trade} onDelete={() => onDeleteTrade(trade.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Journal
