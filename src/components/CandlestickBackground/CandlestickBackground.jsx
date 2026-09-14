import { useMemo } from 'react'
import './CandlestickBackground.css'

// Decorative candlestick-bar background texture.
function CandlestickBackground({ opacity = 0.16, count = 60 }) {
  const candles = useMemo(() => {
    return Array.from({ length: count }, () => {
      const bodyHeight = 12 + Math.random() * 90
      const wickTop = Math.random() * 30
      const wickBottom = Math.random() * 30
      const isUp = Math.random() > 0.5
      return { bodyHeight, wickTop, wickBottom, isUp }
    })
  }, [count])

  return (
    <div className="candlestick-bg" style={{ opacity }} aria-hidden="true">
      {candles.map((candle, index) => (
        <div key={index} className={`candle ${candle.isUp ? 'candle_up' : 'candle_down'}`}>
          <div className="candle__wick" style={{ height: `${candle.wickTop}px` }} />
          <div className="candle__body" style={{ height: `${candle.bodyHeight}px` }} />
          <div className="candle__wick" style={{ height: `${candle.wickBottom}px` }} />
        </div>
      ))}
    </div>
  )
}

export default CandlestickBackground
