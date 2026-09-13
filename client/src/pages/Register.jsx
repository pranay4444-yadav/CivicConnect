import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            CivicConnect
          </Link>

          <h1>Create your account</h1>
          <p>
            Join your community and help make your neighbourhood better.
          </p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email address</label>
            <input
              type="email"
              id="register-email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Neighbourhood / Area</label>
            <input
              type="text"
              id="location"
              placeholder="e.g. Indiranagar"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              type="password"
              id="register-password"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Re-enter your password"
              required
            />
          </div>

          <label className="terms-checkbox">
            <input type="checkbox" required />
            <span>
              I agree to the CivicConnect terms and community guidelines.
            </span>
          </label>

          <button type="submit" className="btn btn-primary auth-button">
            Create Account
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default Register;