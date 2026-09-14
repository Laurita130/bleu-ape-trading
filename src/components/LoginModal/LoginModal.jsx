import { useEffect, useState } from 'react'
import ModalWithForm from '../ModalWithForm/ModalWithForm.jsx'

function LoginModal({ isOpen, onClose, onSwitchToRegister, onForgotPassword, onLogin, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Clear the form whenever the modal closes, so it's fresh next time it opens.
  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
    }
  }, [isOpen])

  function handleSubmit() {
    onLogin({ email, password })
  }

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Log in"
      buttonText="Log in"
      onSubmit={handleSubmit}
      error={error}
    >
      <label className="modal__label" htmlFor="login-email">
        Email
        <input
          id="login-email"
          className="modal__input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          required
        />
      </label>
      <label className="modal__label" htmlFor="login-password">
        Password
        <input
          id="login-password"
          className="modal__input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          required
          minLength={6}
        />
      </label>
      <button type="button" className="modal__switch" onClick={onForgotPassword}>
        Forgot password?
      </button>
      <button type="button" className="modal__switch" onClick={onSwitchToRegister}>
        Need an account? Sign up
      </button>
    </ModalWithForm>
  )
}

export default LoginModal
