import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import CommunityTab from '../../components/CommunityTab/CommunityTab.jsx'
import MessagesTab from '../../components/MessagesTab/MessagesTab.jsx'
import AnnouncementsTab from '../../components/AnnouncementsTab/AnnouncementsTab.jsx'
import BinaryRainBackground from '../../components/BinaryRainBackground/BinaryRainBackground.jsx'
import './Nest.css'

const TABS = [
  { id: 'community', label: 'Community' },
  { id: 'messages', label: 'Messages' },
  { id: 'announcements', label: 'Announcements' },
]

function Nest({ currentUser }) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'community')

  return (
    <section className="nest">
      <BinaryRainBackground />
      <div className="nest__content">
        <h1 className="nest__title">The Nest</h1>

        <div className="nest__tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`nest__tab${activeTab === tab.id ? ' nest__tab_active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'community' && <CommunityTab currentUser={currentUser} />}
        {activeTab === 'messages' && <MessagesTab currentUser={currentUser} />}
        {activeTab === 'announcements' && <AnnouncementsTab currentUser={currentUser} />}
      </div>
    </section>
  )
}

export default Nest
