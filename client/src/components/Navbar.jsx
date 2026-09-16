import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error reading user data:", error);
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  const isAuthority =
    user?.role === "AUTHORITY" ||
    user?.role === "ADMIN";

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <Link to="/" className="logo">
          <span className="logo-mark">C</span>
          <span>CivicConnect</span>
        </Link>

        {/* Navigation */}

        <nav className="nav-links">
          <Link to="/">
            Home
          </Link>

          <Link to="/issues">
            Issues
          </Link>

          <Link to="/community">
            Community
          </Link>

          <Link to="/about">
            About
          </Link>

          {isAuthority && (
            <Link to="/authority">
              Authority Dashboard
            </Link>
          )}
        </nav>

        {/* Actions */}

        <div className="nav-actions">

          {!user ? (
            <>
              <Link
                to="/login"
                className="nav-login"
              >
                Log in
              </Link>

              <Link
                to="/report"
                className="btn btn-primary"
              >
                Report an Issue
              </Link>
            </>
          ) : (
            <>
              <span className="nav-user">
                Hi, {user.name}
              </span>

              <Link
                to="/report"
                className="btn btn-primary"
              >
                Report an Issue
              </Link>

              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;