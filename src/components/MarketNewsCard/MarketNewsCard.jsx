import './MarketNewsCard.css'

function MarketNewsCard({ article }) {
  const date = article.datetime
    ? new Date(article.datetime * 1000).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <a className="market-news-card" href={article.url} target="_blank" rel="noreferrer">
      {article.image && <img className="market-news-card__image" src={article.image} alt="" />}
      <div className="market-news-card__body">
        <p className="market-news-card__source">
          {article.source} {date && `· ${date}`}
        </p>
        <h3 className="market-news-card__headline">{article.headline}</h3>
        <p className="market-news-card__summary">{article.summary}</p>
      </div>
    </a>
  )
}

export default MarketNewsCard
