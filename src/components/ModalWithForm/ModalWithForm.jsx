import './ModalWithForm.css'

// Generic reusable modal. Specific modals (LoginModal, RegisterModal, ...)
// wrap this and pass in their own fields as children.
function ModalWithForm({
  isOpen,
  onClose,
  title,
  children,
  buttonText = 'Submit',
  onSubmit,
  error,
  message,
}) {
  if (!isOpen) return null

  function handleOverlayMouseDown(evt) {
    // Only close if the click started on the overlay itself, not the card
    if (evt.target === evt.currentTarget) onClose()
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    onSubmit?.(evt)
  }

  return (
    <div className="modal" onMouseDown={handleOverlayMouseDown}>
      <div className="modal__container">
        <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title">{title}</h2>
        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          {children}
          {message && <p className="modal__success">{message}</p>}
          {error && <p className="modal__error">{error}</p>}
          <button type="submit" className="modal__submit">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ModalWithForm
