import { useEffect, useState } from 'react'
import { getAllUsers } from '../../utils/auth.js'
import { getFriends } from '../../utils/community.js'
import {
  getConversation,
  getConversationsFor,
  sendMessage,
  markConversationRead,
} from '../../utils/messages.js'
import './MessagesTab.css'

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function MessagesTab({ currentUser }) {
  const [allUsers] = useState(() => getAllUsers())
  const [conversations, setConversations] = useState(() => getConversationsFor(currentUser.email))
  const friends = getFriends(currentUser.email)
  const friendUsers = allUsers.filter((user) => friends.includes(user.email))

  // Anyone you already have a conversation with still shows up, even if
  // you're not (or no longer) friends, so old threads aren't hidden.
  const partnerEmails = conversations.map((conversation) => conversation.partnerEmail)
  const extraContacts = allUsers.filter(
    (user) =>
      partnerEmails.includes(user.email) &&
      !friends.includes(user.email) &&
      user.email !== currentUser.email
  )
  const messageableUsers = [...friendUsers, ...extraContacts]

  const [activePartnerEmail, setActivePartnerEmail] = useState(
    conversations[0]?.partnerEmail || messageableUsers[0]?.email || null
  )
  const [draft, setDraft] = useState('')
  const [thread, setThread] = useState([])

  useEffect(() => {
    if (!activePartnerEmail) {
      setThread([])
      return
    }
    setThread(getConversation(currentUser.email, activePartnerEmail))
    markConversationRead(currentUser.email, activePartnerEmail)
    setConversations(getConversationsFor(currentUser.email))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePartnerEmail])

  function refresh(partnerEmail) {
    setConversations(getConversationsFor(currentUser.email))
    setThread(getConversation(currentUser.email, partnerEmail))
  }

  function handleSend(evt) {
    evt.preventDefault()
    if (!draft.trim() || !activePartnerEmail) return
    sendMessage(currentUser.email, activePartnerEmail, draft)
    setDraft('')
    refresh(activePartnerEmail)
  }

  function partnerName(email) {
    return allUsers.find((user) => user.email === email)?.name || email
  }

  return (
    <div className="messages">
      <aside className="messages__sidebar">
        <h2 className="messages__heading">Conversations</h2>
        {messageableUsers.length === 0 ? (
          <p className="messages__empty">Add a friend in Community to start messaging.</p>
        ) : (
          <ul className="messages__list">
            {messageableUsers.map((user) => {
              const conversation = conversations.find((c) => c.partnerEmail === user.email)
              return (
                <li key={user.email}>
                  <button
                    type="button"
                    className={`messages__contact${
                      activePartnerEmail === user.email ? ' messages__contact_active' : ''
                    }`}
                    onClick={() => setActivePartnerEmail(user.email)}
                  >
                    <span className="messages__contact-name">{user.name}</span>
                    {conversation?.unread > 0 && (
                      <span className="messages__unread-badge">{conversation.unread}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </aside>

      <div className="messages__thread">
        {activePartnerEmail ? (
          <>
            <h3 className="messages__thread-title">{partnerName(activePartnerEmail)}</h3>
            <div className="messages__bubbles">
              {thread.length === 0 && <p className="messages__empty">No messages yet — say hi!</p>}
              {thread.map((message) => (
                <div
                  key={message.id}
                  className={`messages__bubble${
                    message.from === currentUser.email ? ' messages__bubble_mine' : ''
                  }`}
                >
                  <p className="messages__bubble-text">{message.text}</p>
                  <span className="messages__bubble-time">{formatTime(message.timestamp)}</span>
                </div>
              ))}
            </div>
            <form className="messages__form" onSubmit={handleSend}>
              <input
                type="text"
                className="messages__input"
                placeholder="Type a message..."
                value={draft}
                onChange={(evt) => setDraft(evt.target.value)}
              />
              <button type="submit" className="messages__send-btn">
                Send
              </button>
            </form>
          </>
        ) : (
          <p className="messages__empty">Select a conversation to start messaging.</p>
        )}
      </div>
    </div>
  )
}

export default MessagesTab
