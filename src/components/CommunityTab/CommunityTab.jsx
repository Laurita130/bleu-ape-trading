import { useMemo, useState } from 'react'
import { getAllUsers } from '../../utils/auth.js'
import { getFriends, getRecommendations, addFriend, removeFriend } from '../../utils/community.js'
import './CommunityTab.css'

function CommunityTab({ currentUser }) {
  const [refreshTick, setRefreshTick] = useState(0)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const allUsers = useMemo(() => getAllUsers(), [refreshTick])
  const friends = getFriends(currentUser.email)
  const friendUsers = allUsers.filter((user) => friends.includes(user.email))
  const recommendations = getRecommendations(currentUser.email, allUsers)

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []
    return allUsers.filter(
      (user) =>
        user.email !== currentUser.email &&
        !friends.includes(user.email) &&
        user.name.toLowerCase().includes(query)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsers, searchQuery, currentUser.email])

  function handleAddFriend(email) {
    addFriend(currentUser.email, email)
    setRefreshTick((tick) => tick + 1)
  }

  function handleRemoveFriend(email) {
    removeFriend(currentUser.email, email)
    setRefreshTick((tick) => tick + 1)
  }

  function handleToggleAddFriend() {
    setShowAddFriend((open) => !open)
    setSearchQuery('')
  }

  return (
    <div className="community">
      <section className="community__section">
        <div className="community__section-header">
          <h2 className="community__heading">Your Friends ({friendUsers.length})</h2>
          <button
            type="button"
            className="community__add-toggle"
            onClick={handleToggleAddFriend}
            aria-label={showAddFriend ? 'Close add friend search' : 'Add a friend'}
            title={showAddFriend ? 'Close' : 'Add a friend'}
          >
            {showAddFriend ? '×' : '+'}
          </button>
        </div>

        {showAddFriend && (
          <div className="community__search">
            <input
              type="text"
              className="community__search-input"
              placeholder="Search traders by name..."
              value={searchQuery}
              onChange={(evt) => setSearchQuery(evt.target.value)}
              autoFocus
            />
            {searchQuery.trim() && (
              <div className="community__grid community__grid_compact">
                {searchResults.length === 0 ? (
                  <p className="community__empty">No traders match "{searchQuery}".</p>
                ) : (
                  searchResults.map((user) => (
                    <div className="community__card" key={user.email}>
                      <p className="community__name">{user.name}</p>
                      <button
                        type="button"
                        className="community__add-btn"
                        onClick={() => handleAddFriend(user.email)}
                      >
                        Add Friend
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {friendUsers.length === 0 ? (
          <p className="community__empty">
            You haven't added any friends yet — search above or check the suggestions below.
          </p>
        ) : (
          <div className="community__grid">
            {friendUsers.map((user) => (
              <div className="community__card" key={user.email}>
                <p className="community__name">{user.name}</p>
                <button
                  type="button"
                  className="community__remove-btn"
                  onClick={() => handleRemoveFriend(user.email)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="community__section">
        <h2 className="community__heading">People You May Know</h2>
        {recommendations.length === 0 ? (
          <p className="community__empty">No other traders have joined yet — invite some friends!</p>
        ) : (
          <div className="community__grid">
            {recommendations.map((user) => (
              <div className="community__card" key={user.email}>
                <p className="community__name">{user.name}</p>
                {user.mutualCount > 0 && (
                  <p className="community__mutual">
                    {user.mutualCount} mutual friend{user.mutualCount > 1 ? 's' : ''}
                  </p>
                )}
                <button
                  type="button"
                  className="community__add-btn"
                  onClick={() => handleAddFriend(user.email)}
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default CommunityTab
