import './AuthGate.css'

// Shown instead of the app's pages whenever nobody is logged in. This is
// the "wall" that makes the Dashboard, Journal, Learn, and Resources
// pages unreachable until someone creates an account or logs in.
function AuthGate({ onLoginClick, onRegisterClick }) {
  return (
    <section className="auth-gate">
      <div className="auth-gate__card">
        <p className="auth-gate__eyebrow">Members only</p>
        <h1 className="auth-gate__title">Create a free account to get started</h1>
        <p className="auth-gate__text">
          Your dashboard, trade journal, learning hub, and resources are all waiting —
          just sign up or log in first.
        </p>
        <div className="auth-gate__actions">
          <button
            type="button"
            className="header__auth-btn header__auth-btn_type_primary"
            onClick={onRegisterClick}
          >
            Create account
          </button>
          <button type="button" className="header__auth-btn" onClick={onLoginClick}>
            Log in
          </button>
        </div>
      </div>
    </section>
  )
}

export default AuthGate
