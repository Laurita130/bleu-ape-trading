// Open-Meteo is free and requires no API key/signup — a good fit alongside
// the browser's own geolocation so "today's weather" means wherever the
// person actually is. Docs: https://open-meteo.com/en/docs
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

// WMO weather codes -> a short label + emoji. Not every code, just the
// common ones; anything else falls back to a generic label below.
const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mostly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Foggy', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌧️' },
  61: { label: 'Light rain', icon: '🌦️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  80: { label: 'Rain showers', icon: '🌦️' },
  81: { label: 'Rain showers', icon: '🌧️' },
  82: { label: 'Violent showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Thunderstorm', icon: '⛈️' },
}

function describeWeatherCode(code) {
  return WEATHER_CODES[code] || { label: 'Weather', icon: '🌡️' }
}

// Falls back here if the browser won't share (or doesn't have) a location —
// West Palm Beach, FL — so the weather always shows something instead of
// erroring out.
const FALLBACK_LOCATION = { latitude: 26.7153, longitude: -80.0534, label: 'West Palm Beach, FL' }

function getCurrentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null),
      { timeout: 8000, maximumAge: 10 * 60 * 1000 }
    )
  })
}

// Returns both the current conditions and today's expected high/low so the
// banner can show "what it's doing right now" and "what to expect today".
// Tries the browser's real location first; if that's denied/unavailable it
// quietly falls back to West Palm Beach, FL instead of showing an error.
export async function getLocalWeather() {
  const position = await getCurrentPosition()
  const usedFallback = !position
  const { latitude, longitude } = position ? position.coords : FALLBACK_LOCATION

  const url =
    `${BASE_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
    `&temperature_unit=fahrenheit&timezone=auto`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`)
  }

  const data = await response.json()
  const current = describeWeatherCode(data.current.weather_code)
  const today = describeWeatherCode(data.daily.weather_code[0])

  return {
    temperatureF: Math.round(data.current.temperature_2m),
    label: current.label,
    icon: current.icon,
    highF: Math.round(data.daily.temperature_2m_max[0]),
    lowF: Math.round(data.daily.temperature_2m_min[0]),
    dailyLabel: today.label,
    locationLabel: usedFallback ? FALLBACK_LOCATION.label : null,
  }
}
