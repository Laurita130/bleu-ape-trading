const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY
const BASE_URL = 'https://finnhub.io/api/v1'


export async function getMarketNews() {
  const response = await fetch(`${BASE_URL}/news?category=general&token=${API_KEY}`)

  if (!response.ok) {
    throw new Error(`Finnhub request failed with status ${response.status}`)
  }

  const data = await response.json()

  return data.slice(0, 6)
}
