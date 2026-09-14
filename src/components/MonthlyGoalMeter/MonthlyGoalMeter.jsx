import { useState } from 'react'
import {
  getMonthlyGoal,
  setMonthlyGoal,
  computeMonthlyPnl,
} from '../../utils/monthlyGoal.js'
import { TargetIcon } from '../Icons/Icons.jsx'
import './MonthlyGoalMeter.css'

function formatCurrency(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toFixed(2)}`
}

// A green-to-red gauge for this month's P&L against a user-set goal. The
// gauge itself is always visible — the goal just starts at $0 until the
// user sets one via "Edit Goal" — so the Journal page looks the same from
// the very first visit instead of showing a separate "enter a goal" screen.
function MonthlyGoalMeter({ trades }) {
  const [goal, setGoal] = useState(() => getMonthlyGoal() || 0)
  const [isEditing, setIsEditing] = useState(false)
  const [goalInput, setGoalInput] = useState('')

  const monthlyPnl = computeMonthlyPnl(trades)
  const hasGoal = goal > 0

  function handleStartEditing() {
    setGoalInput(hasGoal ? String(goal) : '')
    setIsEditing(true)
  }

  function handleSetGoal(evt) {
    evt.preventDefault()
    const value = Number(goalInput)
    if (!Number.isFinite(value) || value <= 0) return
    setMonthlyGoal(value)
    setGoal(value)
    setIsEditing(false)
  }

  // Before a real goal is set there's nothing to gauge against, so the
  // marker just sits at the neutral center rather than at some arbitrary
  // scale.
  const bound = hasGoal ? goal : 1
  const clampedPnl = Math.min(Math.max(monthlyPnl, -bound), bound)
  const markerPosition = hasGoal ? ((clampedPnl + bound) / (bound * 2)) * 100 : 50
  const reached = hasGoal && monthlyPnl >= goal

  return (
    <div className="monthly-goal">
      <div className="monthly-goal__header">
        <p className="monthly-goal__label">Monthly P&amp;L Goal</p>
        {!isEditing && (
          <button type="button" className="monthly-goal__edit" onClick={handleStartEditing}>
            Edit Goal
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="monthly-goal__form" onSubmit={handleSetGoal}>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 2000"
            className="monthly-goal__input"
            value={goalInput}
            onChange={(evt) => setGoalInput(evt.target.value)}
            autoFocus
            required
          />
          <button type="submit" className="monthly-goal__submit">
            Save
          </button>
          <button type="button" className="monthly-goal__cancel" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="monthly-goal__track">
            <div className="monthly-goal__zero-line" />
            <div className="monthly-goal__marker" style={{ left: `${markerPosition}%` }} />
          </div>

          <div className="monthly-goal__figures">
            <span
              className={`monthly-goal__pnl ${
                monthlyPnl >= 0 ? 'monthly-goal__pnl_positive' : 'monthly-goal__pnl_negative'
              }`}
            >
              {formatCurrency(monthlyPnl)}
            </span>
            <span className="monthly-goal__goal-text">Goal: ${goal.toFixed(2)}</span>
          </div>

          {reached && (
            <p className="monthly-goal__reached">
              <TargetIcon /> Goal reached this month!
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default MonthlyGoalMeter
