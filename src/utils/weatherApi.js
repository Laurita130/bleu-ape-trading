// Open-Meteo is free and requires no API key/signup — a good fit alongside
// the browser's own geolocation so "today's weather" means wherever the
// person actually is. Docs: https://open-meteo.com/en/docs
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

// WMO weather codes -> a short label + icon key (rendered as an SVG icon by
// the WeatherIcon component). Not every code, just the common ones; anything
// else falls back to a generic label below.
const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mostly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'cloud' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Foggy', icon: 'fog' },
  48: { label: 'Foggy', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'rain' },
  53: { label: 'Drizzle', icon: 'rain' },
  55: { label: 'Heavy drizzle', icon: 'rain' },
  61: { label: 'Light rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  71: { label: 'Light snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  80: { label: 'Rain showers', icon: 'rain' },
  81: { label: 'Rain showers', icon: 'rain' },
  82: { label: 'Violent showers', icon: 'storm' },
  95: { label: 'Thunderstorm', icon: 'storm' },
  96: { label: 'Thunderstorm', icon: 'storm' },
  99: { label: 'Thunderstorm', icon: 'storm' },
}

function describeWeatherCode(code) {
  return WEATHER_CODES[code] || { label: 'Weather', icon: 'thermometer' }
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
