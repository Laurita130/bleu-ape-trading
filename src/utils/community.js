// Friends + friend recommendations.
const FRIENDS_KEY = 'apex_trading_friends'

function getFriendMap() {
  try {
    const raw = localStorage.getItem(FRIENDS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveFriendMap(map) {
  try {
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(map))
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail silently
  }
}

export function getFriends(email) {
  const map = getFriendMap()
  return map[email] || []
}

export function areFriends(a, b) {
  return getFriends(a).includes(b)
}

// Friendships are symmetric — adding one links both accounts.
export function addFriend(email, friendEmail) {
  if (!email || !friendEmail || email === friendEmail) return
  const map = getFriendMap()
  map[email] = Array.from(new Set([...(map[email] || []), friendEmail]))
  map[friendEmail] = Array.from(new Set([...(map[friendEmail] || []), email]))
  saveFriendMap(map)
}

export function removeFriend(email, friendEmail) {
  const map = getFriendMap()
  map[email] = (map[email] || []).filter((entry) => entry !== friendEmail)
  map[friendEmail] = (map[friendEmail] || []).filter((entry) => entry !== email)
  saveFriendMap(map)
}

// "People you may know" — ranks everyone who isn't already a friend by how
// many mutual friends they share with you (highest first), the same basic
// idea as a Facebook-style friend suggestion. Everyone still shows up even
// with zero mutual friends, just at the bottom of the list.
export function getRecommendations(email, allUsers) {
  const myFriends = getFriends(email)
  const candidates = allUsers.filter(
    (user) => user.email !== email && !myFriends.includes(user.email)
  )

  const scored = candidates.map((user) => {
    const theirFriends = getFriends(user.email)
    const mutualCount = theirFriends.filter((friendEmail) => myFriends.includes(friendEmail)).length
    return { ...user, mutualCount }
  })

  scored.sort((a, b) => b.mutualCount - a.mutualCount || a.name.localeCompare(b.name))
  return scored
}
