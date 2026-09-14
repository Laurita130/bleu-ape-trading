// Small inline SVG icon set used in place of emoji glyphs across the app —
// SVG scales cleanly at any size/resolution and can be recolored with CSS
// (currentColor) instead of relying on the OS's emoji font.

export function BellIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function FireIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.3-2-1-3 1.5 1 2.5 3 2.5 5a7.5 7.5 0 1 1-15 0c0-4 2-6 3-7 1 1 1.5 2 1.5 3 0-2-1-3-1-5Z" />
    </svg>
  )
}

export function TargetIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  )
}

function CloudIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6.5 18a4 4 0 1 1 .4-7.98A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1-.5 8.5H6.5Z" />
    </svg>
  )
}

function RainIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6.5 15a4 4 0 1 1 .4-7.98A5.5 5.5 0 0 1 17 8.5a3.5 3.5 0 0 1-.5 6.5H6.5Z" />
      <path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" />
    </svg>
  )
}

function SnowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6.5 14a4 4 0 1 1 .4-7.98A5.5 5.5 0 0 1 17 7.5a3.5 3.5 0 0 1-.5 6.5H6.5Z" />
      <path d="M8 18v3M8 18l-1.5 1M8 18l1.5 1M12 19v3M12 19l-1.5 1M12 19l1.5 1M16 18v3M16 18l-1.5 1M16 18l1.5 1" />
    </svg>
  )
}

function StormIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6.5 13a4 4 0 1 1 .4-7.98A5.5 5.5 0 0 1 17 6.5a3.5 3.5 0 0 1-.5 6.5H6.5Z" />
      <path d="M12 14l-2 4h3l-2 4" />
    </svg>
  )
}

function FogIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M4 9h16M4 13h16M4 17h10" />
    </svg>
  )
}

function ThermometerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 14.5V4.5a2 2 0 1 0-4 0v10a4 4 0 1 0 4 0Z" />
    </svg>
  )
}

const WEATHER_ICONS = {
  sun: SunIcon,
  cloud: CloudIcon,
  rain: RainIcon,
  snow: SnowIcon,
  storm: StormIcon,
  fog: FogIcon,
  thermometer: ThermometerIcon,
}

// Renders the SVG icon matching a weather icon key (see weatherApi.js),
// falling back to a generic thermometer if the key is unrecognized.
export function WeatherIcon({ name, ...props }) {
  const Component = WEATHER_ICONS[name] || ThermometerIcon
  return <Component {...props} />
}
