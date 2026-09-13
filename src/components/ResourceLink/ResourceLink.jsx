import './ResourceLink.css'

function ResourceLink({ resource, onDelete }) {
  const formattedDate = resource.dateAdded
    ? new Date(resource.dateAdded).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="resource-link">
      <a className="resource-link__body" href={resource.url} target="_blank" rel="noreferrer">
        <h3 className="resource-link__name">{resource.name}</h3>
        {resource.description && <p className="resource-link__description">{resource.description}</p>}
      </a>
      <div className="resource-link__meta">
        {formattedDate ? (
          <span className="resource-link__date">Added {formattedDate}</span>
        ) : (
          <span />
        )}
        {onDelete && (
          <button type="button" className="resource-link__remove" onClick={onDelete}>
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default ResourceLink
