// Profile pictures, stored as data URLs in localStorage, keyed by account
// email.
const PROFILE_PICTURES_KEY = 'apex_trading_profile_pictures'

function getPictureMap() {
  try {
    const raw = localStorage.getItem(PROFILE_PICTURES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getProfilePicture(email) {
  if (!email) return null
  return getPictureMap()[email] || null
}

export function setProfilePicture(email, dataUrl) {
  if (!email) return
  try {
    const map = getPictureMap()
    map[email] = dataUrl
    localStorage.setItem(PROFILE_PICTURES_KEY, JSON.stringify(map))
  } catch {
    // ignore write failures (e.g. storage full/disabled)
  }
}
