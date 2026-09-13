
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

  }
}

export function clearMonthlyGoal() {
  try {
    localStorage.removeItem(GOAL_KEY)
  } catch {
    
  }
}

export function getCurrentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}


export function computeMonthlyPnl(trades) {
  const monthKey = getCurrentMonthKey()
  return trades
    .filter((trade) => trade.date && trade.date.slice(0, 7) === monthKey)
    .reduce((sum, trade) => sum + trade.pnl, 0)
}
