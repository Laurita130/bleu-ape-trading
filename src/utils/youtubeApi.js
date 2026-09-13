const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY


const CHANNEL_ID = 'UCEAq-8Ih0WI6R7wYoCFiWmA'

const UPLOADS_PLAYLIST_ID = CHANNEL_ID.replace(/^UC/, 'UU')

// Docs: https://developers.google.com/youtube/v3/docs/playlistItems/list
export async function getLatestChannelVideos(maxResults = 3) {
  if (!API_KEY) {
    throw new Error('Missing VITE_YOUTUBE_API_KEY in .env')
  }

  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet` +
    `&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=${maxResults}&key=${API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`YouTube request failed with status ${response.status}`)
  }

  const data = await response.json()
  return data.items.map((item) => ({
    id: item.snippet.resourceId.videoId,
    youtubeId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
  }))
}
