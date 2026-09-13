import { useCallback, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import LoginModal from './components/LoginModal/LoginModal.jsx'
import RegisterModal from './components/RegisterModal/RegisterModal.jsx'
import ForgotPasswordModal from './components/ForgotPasswordModal/ForgotPasswordModal.jsx'
import AuthGate from './components/AuthGate/AuthGate.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Journal from './pages/Journal/Journal.jsx'
import Nest from './pages/Nest/Nest.jsx'
import Courses from './pages/Courses/Courses.jsx'
import Resources from './pages/Resources/Resources.jsx'
import {
  getTrades,
  addTrade,
  deleteTrade,
  upsertCalendarTrade,
  removeCalendarTrade,
} from './utils/trades.js'
import { getCurrentUser, loginUser, registerUser, logoutUser, resetPassword } from './utils/auth.js'
import { startActiveSegment, stopActiveSegment } from './utils/sessionTime.js'
import { hasUnread } from './utils/messages.js'
import { hasUnseenAnnouncements } from './utils/announcements.js'
import './App.css'

function App() {
  // 'login' | 'register' | 'forgot' | null — only one modal open at a time
  const [activeModal, setActiveModal] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [authMessage, setAuthMessage] = useState(null)
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [trades, setTrades] = useState(() => getTrades())
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false)

  const closeModal = useCallback(() => {
    setActiveModal(null)
    setAuthError(null)
    setAuthMessage(null)
  }, [])

  function openModal(modal) {
    setAuthError(null)
    setAuthMessage(null)
    setActiveModal(modal)
  }

  // Close whichever modal is open when the user presses Escape
  useEffect(() => {
    function handleEscape(evt) {
      if (evt.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeModal])

  // "Time On App" should only tick while the user is actually logged in —
  // start the clock on login, bank the elapsed time on logout (or if the
  // tab closes while still logged in).
  useEffect(() => {
    if (!currentUser) return undefined

    startActiveSegment()

    function handleBeforeUnload() {
      stopActiveSegment()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      stopActiveSegment()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentUser])

  // Keeps the header bell in sync with new messages and announcements.
  useEffect(() => {
    if (!currentUser) {
      setHasUnreadMessages(false)
      setHasNewAnnouncement(false)
      return undefined
    }

    function checkNotifications() {
      setHasUnreadMessages(hasUnread(currentUser.email))
      setHasNewAnnouncement(hasUnseenAnnouncements(currentUser.email))
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 3000)
    return () => clearInterval(interval)
  }, [currentUser])

  function handleAddTrade(trade) {
    setTrades(addTrade(trade))
  }

  function handleDeleteTrade(id) {
    setTrades(deleteTrade(id))
  }

  // The calendar's own P&L field feeds straight into the same trades list
  // the Journal reads from — an empty value clears that day's entry instead
  // of leaving a stray $0 trade behind.
  function handleSaveCalendarEntry(date, pnl, notes) {
    if (pnl === '' || pnl === null || pnl === undefined || Number.isNaN(Number(pnl))) {
      setTrades(removeCalendarTrade(date))
    } else {
      setTrades(upsertCalendarTrade(date, pnl, notes))
    }
  }

  function handleLogin(credentials) {
    try {
      const user = loginUser(credentials)
      setCurrentUser(user)
      closeModal()
    } catch (err) {
      setAuthError(err.message)
    }
  }

  function handleRegister(details) {
    try {
      const user = registerUser(details)
      setCurrentUser(user)
      closeModal()
    } catch (err) {
      setAuthError(err.message)
    }
  }

  function handleResetPassword(details) {
    try {
      resetPassword(details)
      setAuthError(null)
      setAuthMessage('Password reset — you can log in with your new password now.')
    } catch (err) {
      setAuthMessage(null)
      setAuthError(err.message)
    }
  }

  function handleLogout() {
    logoutUser()
    setCurrentUser(null)
  }

  return (
    <div className="app">
      <Header
        currentUser={currentUser}
        onLoginClick={() => openModal('login')}
        onRegisterClick={() => openModal('register')}
        onLogout={handleLogout}
        hasUnreadMessages={hasUnreadMessages}
        hasNewAnnouncement={hasNewAnnouncement}
      />

      <main className="app__content">
        {currentUser ? (
          <Routes>
            <Route path="/" element={<Dashboard trades={trades} currentUser={currentUser} onSaveCalendarEntry={handleSaveCalendarEntry} />} />
            <Route
              path="/journal"
              element={
                <Journal
                  trades={trades}
                  onAddTrade={handleAddTrade}
                  onDeleteTrade={handleDeleteTrade}
                />
              }
            />
            <Route path="/nest" element={<Nest currentUser={currentUser} />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        ) : (
          <AuthGate onLoginClick={() => openModal('login')} onRegisterClick={() => openModal('register')} />
        )}
      </main>

      <Footer />

      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={closeModal}
        onSwitchToRegister={() => openModal('register')}
        onForgotPassword={() => openModal('forgot')}
        onLogin={handleLogin}
        error={activeModal === 'login' ? authError : null}
      />
      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={closeModal}
        onSwitchToLogin={() => openModal('login')}
        onRegister={handleRegister}
        error={activeModal === 'register' ? authError : null}
      />
      <ForgotPasswordModal
        isOpen={activeModal === 'forgot'}
        onClose={closeModal}
        onSwitchToLogin={() => openModal('login')}
        onResetPassword={handleResetPassword}
        error={activeModal === 'forgot' ? authError : null}
        message={activeModal === 'forgot' ? authMessage : null}
      />
    </div>
  )
}

export default App
