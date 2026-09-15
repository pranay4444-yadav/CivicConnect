import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          <span className="logo-mark">C</span>
          <span>CivicConnect</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/issues">Issues</Link>
          <Link to="/community">Community</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="nav-login">
            Log in
          </Link>

          <Link to="/report" className="btn btn-primary">
            Report an Issue
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;