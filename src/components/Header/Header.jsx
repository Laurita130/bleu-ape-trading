import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../Navigation/Navigation.jsx'
import logoIcon from '../../assets/apex-trading-icon.png'
import { getProfilePicture, setProfilePicture } from '../../utils/profile.js'
import './Header.css'

function getInitial(name) {
  return name ? name.trim().charAt(0).toUpperCase() : '?'
}

function Header({
  currentUser,
  onLoginClick,
  onRegisterClick,
  onLogout,
  hasUnreadMessages,
  hasNewAnnouncement,
}) {
  const [avatar, setAvatar] = useState(null)

  // Load whichever picture is on file for this account whenever who's
  // logged in changes.
  useEffect(() => {
    setAvatar(currentUser ? getProfilePicture(currentUser.email) : null)
  }, [currentUser])

  function handleAvatarChange(evt) {
    const file = evt.target.files?.[0]
    if (!file || !currentUser) return

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        // Downscale before storing — localStorage has a size limit, and a
        // full-resolution photo has no business being a 34px avatar anyway.
        const maxSize = 128
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        setProfilePicture(currentUser.email, dataUrl)
        setAvatar(dataUrl)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <img className="header__logo-img" src={logoIcon} alt="" />
        <span className="header__logo-text">Bleu Ape Trading</span>
      </Link>
      {currentUser && <Navigation />}
      {currentUser && (
        <Link
          to="/nest"
          state={{ tab: hasUnreadMessages ? 'messages' : hasNewAnnouncement ? 'announcements' : 'messages' }}
          className={`header__bell${
            hasUnreadMessages
              ? ' header__bell_unread'
              : hasNewAnnouncement
              ? ' header__bell_announcement'
              : ''
          }`}
          aria-label="Notifications"
          title={
            hasUnreadMessages
              ? 'You have new messages'
              : hasNewAnnouncement
              ? 'New announcement'
              : 'Notifications'
          }
        >
          🔔
        </Link>
      )}
      <div className="header__auth">
        {currentUser && (
          <label className="header__avatar" title="Change profile picture">
            {avatar ? (
              <img src={avatar} alt="" className="header__avatar-img" />
            ) : (
              <span className="header__avatar-placeholder">{getInitial(currentUser.name)}</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="header__avatar-input"
              onChange={handleAvatarChange}
            />
          </label>
        )}
        {currentUser ? (
          <button type="button" className="header__auth-btn" onClick={onLogout}>
            Log out
          </button>
        ) : (
          <>
            <button type="button" className="header__auth-btn" onClick={onLoginClick}>
              Log in
            </button>
            <button
              type="button"
              className="header__auth-btn header__auth-btn_type_primary"
              onClick={onRegisterClick}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
