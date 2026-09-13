import { useEffect, useState } from 'react'
import StreakBanner from '../../components/StreakBanner/StreakBanner.jsx'
import MarketNewsCard from '../../components/MarketNewsCard/MarketNewsCard.jsx'
import Preloader from '../../components/Preloader/Preloader.jsx'
import CandlestickBackground from '../../components/CandlestickBackground/CandlestickBackground.jsx'
import TradingCalendar from '../../components/TradingCalendar/TradingCalendar.jsx'
import { getMarketNews } from '../../utils/finnhubApi.js'
import { computeStreak, computeTotalPnl } from '../../utils/trades.js'
import './Dashboard.css'

function Dashboard({ trades, currentUser, onSaveCalendarEntry }) {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    getMarketNews()
      .then(setNews)
      .catch(() => setError('Could not load market news right now — check your Finnhub API key in .env.'))
      .finally(() => setIsLoading(false))
  }, [])

  const streak = computeStreak(trades)
  const totalPnl = computeTotalPnl(trades)

  return (
    <section className="dashboard">
      <CandlestickBackground opacity={0.08} count={50} />
      <div className="dashboard__content">
        <StreakBanner streak={streak} currentUser={currentUser} />

        <section className="dashboard__summary">
          <p className="dashboard__summary-label">Total P&amp;L</p>
          <p
            className={`dashboard__summary-value${
              totalPnl >= 0 ? ' dashboard__summary-value_positive' : ' dashboard__summary-value_negative'
            }`}
          >
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </p>
        </section>

        <div className="dashboard__grid">
          <TradingCalendar trades={trades} onSaveCalendarEntry={onSaveCalendarEntry} />

          <section className="dashboard__news">
            <h2 className="dashboard__news-title">Today's Market News</h2>
            {isLoading && <Preloader />}
            {error && <p className="dashboard__error">{error}</p>}
            {!isLoading && !error && (
              <div className="dashboard__news-list">
                {news.map((article) => (
                  <MarketNewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
