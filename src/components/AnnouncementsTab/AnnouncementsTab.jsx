import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ANNOUNCEMENTS, markAnnouncementsSeen } from '../../utils/announcements.js'
import './AnnouncementsTab.css'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AnnouncementsTab({ currentUser }) {
  // Opening this tab is what clears the bell's yellow "new announcement"
  // state — everything currently in the list counts as seen from here on.
  useEffect(() => {
    markAnnouncementsSeen(currentUser?.email)
  }, [currentUser])

  return (
    <div className="announcements">
      {ANNOUNCEMENTS.map((announcement) => (
        <div className="announcements__card" key={announcement.id}>
          <p className="announcements__date">{formatDate(announcement.date)}</p>
          <h3 className="announcements__title">{announcement.title}</h3>
          <p className="announcements__body">{announcement.body}</p>
          <Link to="/courses" className="announcements__link">
            View in Courses →
          </Link>
        </div>
      ))}
    </div>
  )
}

export default AnnouncementsTab
