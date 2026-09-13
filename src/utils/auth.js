const USERS_KEY = 'apex_trading_users'
const SESSION_KEY = 'apex_trading_session'

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toPublicUser(user) {
  if (!user) return null
  const { name, email } = user
  return { name, email }
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function validatePassword(password) {
  if (password.length < 8 || password.length > 12) {
    throw new Error('Password must be between 8 and 12 characters.')
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error('Password must include at least one special character.')
  }
}

export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

// Public directory of every registered account (name + email only — never
// passwords or recovery emails) for The Nest's community features.
export function getAllUsers() {
  return getUsers().map((user) => toPublicUser(user))
}

export function registerUser({ name, email, password, recoveryEmail }) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedRecovery = recoveryEmail ? recoveryEmail.trim().toLowerCase() : ''

  if (!name.trim() || !normalizedEmail || !password) {
    throw new Error('Please fill in every field.')
  }

  validatePassword(password)

  if (normalizedRecovery && !normalizedRecovery.includes('@')) {
    throw new Error('Please enter a valid recovery email.')
  }

  if (normalizedRecovery && normalizedRecovery === normalizedEmail) {
    throw new Error('Recovery email should be different from your login email.')
  }

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with that email already exists — try logging in instead.')
  }

  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password,
    recoveryEmail: normalizedRecovery,
  }
  saveUsers([...users, newUser])

  const publicUser = toPublicUser(newUser)
  setSession(publicUser)
  return publicUser
}

export function loginUser({ email, password }) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const match = users.find((user) => user.email === normalizedEmail && user.password === password)

  if (!match) {
    throw new Error('Email or password is incorrect.')
  }

  const publicUser = toPublicUser(match)
  setSession(publicUser)
  return publicUser
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}

// Verifies the recovery email on file matches before allowing a password
// reset, then updates the account's password.
export function resetPassword({ email, recoveryEmail, newPassword }) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedRecovery = recoveryEmail.trim().toLowerCase()

  const index = users.findIndex((user) => user.email === normalizedEmail)
  if (index === -1) {
    throw new Error('No account found with that email.')
  }

  const user = users[index]
  if (!user.recoveryEmail) {
    throw new Error('This account doesn\'t have a recovery email on file.')
  }
  if (user.recoveryEmail !== normalizedRecovery) {
    throw new Error('That recovery email doesn\'t match our records.')
  }

  validatePassword(newPassword)

  users[index] = { ...user, password: newPassword }
  saveUsers(users)
  return true
}
