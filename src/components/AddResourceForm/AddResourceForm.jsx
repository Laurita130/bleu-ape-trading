import { useState } from 'react'
import './AddResourceForm.css'

function AddResourceForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  function handleSubmit(evt) {
    evt.preventDefault()
    if (!name.trim() || !url.trim()) return
    onAdd({ name: name.trim(), url: url.trim() })
    setName('')
    setUrl('')
  }

  return (
    <form className="add-resource-form" onSubmit={handleSubmit}>
      <input
        className="add-resource-form__input"
        type="text"
        placeholder="Title (e.g. Investopedia — Options basics)"
        value={name}
        onChange={(evt) => setName(evt.target.value)}
        required
      />
      <input
        className="add-resource-form__input add-resource-form__input_wide"
        type="url"
        placeholder="Paste the link (https://...)"
        value={url}
        onChange={(evt) => setUrl(evt.target.value)}
        required
      />
      <div className="add-resource-form__actions">
        <button type="submit" className="add-resource-form__submit">
          Add resource
        </button>
        <button type="button" className="add-resource-form__cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddResourceForm
