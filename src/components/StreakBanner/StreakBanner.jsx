import { useEffect, useState } from 'react'
import { getLocalWeather } from '../../utils/weatherApi.js'
import './StreakBanner.css'

function StreakBanner({ streak, currentUser }) {
  const [now, setNow] = useState(() => new Date())
  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState(null)

  // Keep the clock ticking so it reads as a live terminal, not a screenshot.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getLocalWeather()
      .then(setWeather)
      .catch(() => setWeatherError('Allow location access to see today\'s weather here.'))
  }, [])

  const hasStreak = streak > 0
  const displayName = currentUser?.name || currentUser?.email || 'Trader'

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timeLabel = now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
  const timeZoneLabel = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <section className="streak-banner">
      <div className="streak-banner__greeting">
        <p className="streak-banner__welcome">Welcome back, {displayName}</p>
        <p className="streak-banner__clock">
          {dateLabel} · {timeLabel}
          <span className="streak-banner__tz"> ({timeZoneLabel})</span>
        </p>
        {weather && (
          <p className="streak-banner__weather">
            {weather.locationLabel && <span className="streak-banner__location">{weather.locationLabel}: </span>}
            {weather.icon} {weather.temperatureF}°F right now, {weather.label.toLowerCase()} · Today: expect{' '}
            {weather.dailyLabel.toLowerCase()}, H:{weather.highF}° L:{weather.lowF}°
          </p>
        )}
        {weatherError && <p className="streak-banner__weather-error">{weatherError}</p>}
      </div>
      <p className="streak-banner__text">
        {hasStreak
          ? `🔥 ${streak}-day trading streak — log one today to keep it going.`
          : "You haven't logged a trade recently. Log one today to start a new streak."}
      </p>
    </section>
  )
}

export default StreakBanner
