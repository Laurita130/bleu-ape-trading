import { useEffect, useState } from 'react'
import ModalWithForm from '../ModalWithForm/ModalWithForm.jsx'

// Verify the recovery email on file for the account, then set a new
// password.
function ForgotPasswordModal({ isOpen, onClose, onSwitchToLogin, onResetPassword, error, message }) {
  const [email, setEmail] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Clear the form whenever the modal closes, so it's fresh next time it opens.
  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setRecoveryEmail('')
      setNewPassword('')
    }
  }, [isOpen])

  function handleSubmit() {
    onResetPassword({ email, recoveryEmail, newPassword })
  }

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Password"
      buttonText="Reset Password"
      onSubmit={handleSubmit}
      error={error}
      message={message}
    >
      <label className="modal__label" htmlFor="forgot-email">
        Account Email
        <input
          id="forgot-email"
          className="modal__input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          required
        />
      </label>
      <label className="modal__label" htmlFor="forgot-recovery-email">
        Recovery Email
        <input
          id="forgot-recovery-email"
          className="modal__input"
          type="email"
          placeholder="backup@example.com"
          value={recoveryEmail}
          onChange={(evt) => setRecoveryEmail(evt.target.value)}
          required
        />
        <span className="modal__hint">The recovery email you set when you signed up</span>
      </label>
      <label className="modal__label" htmlFor="forgot-new-password">
        New Password
        <input
          id="forgot-new-password"
          className="modal__input"
          type="password"
          placeholder="Create a new password"
          value={newPassword}
          onChange={(evt) => setNewPassword(evt.target.value)}
          required
          minLength={8}
          maxLength={12}
        />
        <span className="modal__hint">8–12 characters, with at least one special character</span>
      </label>
      <button type="button" className="modal__switch" onClick={onSwitchToLogin}>
        Back to log in
      </button>
    </ModalWithForm>
  )
}

export default ForgotPasswordModal
