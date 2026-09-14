import { useEffect, useState } from 'react'
import ModalWithForm from '../ModalWithForm/ModalWithForm.jsx'

function RegisterModal({ isOpen, onClose, onSwitchToLogin, onRegister, error }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')

  // Clear the form whenever the modal closes, so it's fresh next time it opens.
  useEffect(() => {
    if (!isOpen) {
      setName('')
      setEmail('')
      setPassword('')
      setRecoveryEmail('')
    }
  }, [isOpen])

  function handleSubmit() {
    onRegister({ name, email, password, recoveryEmail })
  }

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Sign up"
      buttonText="Sign up"
      onSubmit={handleSubmit}
      error={error}
    >
      <label className="modal__label" htmlFor="register-name">
        Name
        <input
          id="register-name"
          className="modal__input"
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(evt) => setName(evt.target.value)}
          required
        />
      </label>
      <label className="modal__label" htmlFor="register-email">
        Email
        <input
          id="register-email"
          className="modal__input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          required
        />
      </label>
      <label className="modal__label" htmlFor="register-password">
        Password
        <input
          id="register-password"
          className="modal__input"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          required
          minLength={8}
          maxLength={12}
        />
        <span className="modal__hint">8–12 characters, with at least one special character</span>
      </label>
      <label className="modal__label" htmlFor="register-recovery-email">
        Recovery Email (optional)
        <input
          id="register-recovery-email"
          className="modal__input"
          type="email"
          placeholder="backup@example.com"
          value={recoveryEmail}
          onChange={(evt) => setRecoveryEmail(evt.target.value)}
        />
        <span className="modal__hint">Used to reset your password if you forget it</span>
      </label>
      <button type="button" className="modal__switch" onClick={onSwitchToLogin}>
        Already have an account? Log in
      </button>
    </ModalWithForm>
  )
}

export default RegisterModal
