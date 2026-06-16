function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span className="auth-card__logo-text">TaskFlow</span>
        </div>

        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Start organizing your tasks today</p>

        <p className="auth-card__footer" style={{ marginTop: 0 }}>
          Already have an account?{" "}
          <a href="/">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
