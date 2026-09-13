import './VideoCard.css'

function VideoCard({ video }) {
  return (
    <article className="video-card">
      <div className="video-card__frame">
        <iframe
          className="video-card__iframe"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allowFullScreen
        />
      </div>
      <h3 className="video-card__title">{video.title}</h3>
    </article>
  )
}

export default VideoCard
