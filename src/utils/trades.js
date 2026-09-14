const STORAGE_KEY = "apex_trading_trades";

export function getTrades() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {

    return [];
  }
}

function persist(trades) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail silently
  }
  return trades;
}

export function addTrade({ ticker, pnl, notes, date }) {
  const trades = getTrades();
  const newTrade = {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : String(Date.now()),
    date: date || new Date().toISOString().slice(0, 10),
    ticker: String(ticker).toUpperCase(),
    pnl: Number(pnl),
    notes: notes || "",
  };
  return persist([newTrade, ...trades]);
}

export function deleteTrade(id) {
  const trades = getTrades().filter((trade) => trade.id !== id);
  return persist(trades);
}

export function upsertCalendarTrade(date, pnl, notes) {
  const trades = getTrades();
  const index = trades.findIndex(
    (trade) => trade.date === date && trade.source === "calendar"
  );

  if (index === -1) {
    const newTrade = {
      id:
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : String(Date.now()),
      date,
      ticker: "CALENDAR",
      pnl: Number(pnl),
      notes: notes || "",
      source: "calendar",
    };
    return persist([newTrade, ...trades]);
  }

  const updated = [...trades];
  updated[index] = { ...updated[index], pnl: Number(pnl), notes: notes || "" };
  return persist(updated);
}

export function removeCalendarTrade(date) {
  const trades = getTrades().filter(
    (trade) => !(trade.date === date && trade.source === "calendar")
  );
  return persist(trades);
}

export function computeTotalPnl(trades) {
  return trades.reduce((sum, trade) => sum + trade.pnl, 0);
}

// Everything the Journal's stats row needs, computed fresh from the trade
// list each render — nothing here is stored separately, so it can never
// drift out of sync with the trades themselves.
export function computeJournalStats(trades) {
  const totalTrades = trades.length;
  const totalPnl = computeTotalPnl(trades);
  const wins = trades.filter((trade) => trade.pnl > 0);
  const losses = trades.filter((trade) => trade.pnl < 0);
  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
  const avgWin =
    wins.length > 0
      ? wins.reduce((sum, trade) => sum + trade.pnl, 0) / wins.length
      : 0;
  const avgLoss =
    losses.length > 0
      ? losses.reduce((sum, trade) => sum + trade.pnl, 0) / losses.length
      : 0;
  const best = trades.reduce(
    (max, trade) => (max === null || trade.pnl > max.pnl ? trade : max),
    null
  );
  const worst = trades.reduce(
    (min, trade) => (min === null || trade.pnl < min.pnl ? trade : min),
    null
  );

  return {
    totalTrades,
    totalPnl,
    wins: wins.length,
    losses: losses.length,
    winRate,
    avgWin,
    avgLoss,
    best,
    worst,
  };
}

// Counts consecutive days (ending today or yesterday) with at least one
// logged trade. Missing today doesn't zero the streak until tomorrow passes
// too, so an evening trader isn't punished for not having logged one yet.
export function computeStreak(trades) {
  if (!trades.length) return 0;

  const days = new Set(trades.map((trade) => trade.date));
  const cursor = new Date();
  const todayIso = cursor.toISOString().slice(0, 10);

  if (!days.has(todayIso)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
