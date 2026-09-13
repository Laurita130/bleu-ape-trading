// The user's monthly P&L goal, persisted so it's still set the next time
// they open the app.
const GOAL_KEY = 'apex_trading_monthly_goal'

export function getMonthlyGoal() {
  try {
    const raw = localStorage.getItem(GOAL_KEY)
    if (!raw) return null
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function setMonthlyGoal(value) {
  try {
    localStorage.setItem(GOAL_KEY, String(value))
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

export function clearMonthlyGoal() {
  try {
    localStorage.removeItem(GOAL_KEY)
  } catch {
    // ignore
  }
}

export function getCurrentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// Sums P&L for trades logged in the current calendar month only, so the
// meter reflects "this month's progress toward the goal", not a lifetime
// total.
export function computeMonthlyPnl(trades) {
  const monthKey = getCurrentMonthKey()
  return trades
    .filter((trade) => trade.date && trade.date.slice(0, 7) === monthKey)
    .reduce((sum, trade) => sum + trade.pnl, 0)
}
