import { useState } from 'react'
import ResourceLink from '../../components/ResourceLink/ResourceLink.jsx'
import AddResourceForm from '../../components/AddResourceForm/AddResourceForm.jsx'
import { getResources, addResource, deleteResource } from '../../utils/resources.js'
import './Resources.css'

function Resources() {
  const [resources, setResources] = useState(() => getResources())
  const [isAdding, setIsAdding] = useState(true)

  function handleAdd(details) {
    setResources(addResource(details))
    setIsAdding(false)
  }

  function handleDelete(id) {
    setResources(deleteResource(id))
  }

  return (
    <section className="resources">
      <div className="resources__header">
        <h1 className="resources__title">Resources</h1>
        <button
          type="button"
          className="resources__add-btn"
          onClick={() => setIsAdding((current) => !current)}
        >
          {isAdding ? '× Cancel' : '+ Add'}
        </button>
      </div>

      {isAdding && <AddResourceForm onAdd={handleAdd} onCancel={() => setIsAdding(false)} />}

      <div className="resources__list">
        {resources.map((resource) => (
          <ResourceLink
            key={resource.id}
            resource={resource}
            
            onDelete={resource.dateAdded ? () => handleDelete(resource.id) : null}
          />
        ))}
      </div>
    </section>
  )
}

export default Resources
