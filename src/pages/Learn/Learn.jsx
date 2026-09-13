import { useEffect, useState } from 'react'
import VideoCard from '../../components/VideoCard/VideoCard.jsx'
import Preloader from '../../components/Preloader/Preloader.jsx'
import CandlestickBackground from '../../components/CandlestickBackground/CandlestickBackground.jsx'
import { getLatestChannelVideos } from '../../utils/youtubeApi.js'
import './Learn.css'


const CURATED_VIDEOS = [
  { id: 'v1', title: 'Add a chart-reading tutorial you like', youtubeId: 'REPLACE_ME_1' },
  { id: 'v2', title: 'Add a risk-management video you like', youtubeId: 'REPLACE_ME_2' },
  { id: 'v3', title: 'Add a market-structure video you like', youtubeId: 'REPLACE_ME_3' },
]

function Learn() {
  const [channelVideos, setChannelVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    getLatestChannelVideos(3)
      .then(setChannelVideos)
      .catch(() =>
        setError('Could not load the latest videos right now — check your YouTube API key in .env.')
      )
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="learn">
      <CandlestickBackground opacity={0.22} count={70} />
      <div className="learn__content">
        <h1 className="learn__title">Learn</h1>

        <h2 className="learn__subtitle">Latest from Jesse Rogers | Casper Trading</h2>
        {isLoading && <Preloader />}
        {error && <p className="learn__error">{error}</p>}
        {!isLoading && !error && (
          <div className="learn__grid">
            {channelVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        <h2 className="learn__subtitle">Picked for you</h2>
        <div className="learn__grid">
          {CURATED_VIDEOS.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Learn
