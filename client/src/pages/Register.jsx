import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Check passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful
      alert("Account created successfully!");

      // Go to login page
      navigate("/login");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="name">
              Full name
            </label>

            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="register-email">
              Email address
            </label>

            <input
              type="email"
              id="register-email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="location">
              Neighbourhood / Area
            </label>

            <input
              type="text"
              id="location"
              placeholder="e.g. Indiranagar"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              type="password"
              id="register-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="confirm-password">
              Confirm password
            </label>

            <input
              type="password"
              id="confirm-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </div>


          <label className="terms-checkbox">
            <input
              type="checkbox"
              required
            />

            <span>
              I agree to the CivicConnect terms and community guidelines.
            </span>
          </label>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="btn btn-primary auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>


        <div className="auth-divider">
          <span>or</span>
        </div>


        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>


        <Link to="/" className="back-home">
          ← Back to home
        </Link>

      </div>
    </div>
  );
}

export default Register;
