import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">CivicConnect</div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/issues">Issues</Link>
          <Link to="/community">Community</Link>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="login-link">
            Log in
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-badge">
              Making communities better, together
            </span>

            <h1>
              Your voice can change
              <span> your community.</span>
            </h1>

            <p>
              Report local issues, connect with your neighbours, and work
              together to make your neighbourhood a better place.
            </p>

            <div className="hero-buttons">
              <Link to="/report" className="btn btn-primary">
                Report an Issue
              </Link>

              <Link to="/issues" className="btn btn-secondary">
                Explore Issues
              </Link>
            </div>
          </div>

          <div className="map-card">
            <div className="map-header">
              <div>
                <strong>Community Issues</strong>
                <p>Nearby reports</p>
              </div>
              <span className="live-badge">● Live</span>
            </div>

            <div className="map-area">
              <div className="map-pin pin-one">📍</div>
              <div className="map-pin pin-two">📍</div>
              <div className="map-pin pin-three">📍</div>

              <div className="map-label label-one">Pothole</div>
              <div className="map-label label-two">Streetlight</div>
              <div className="map-label label-three">Garbage</div>
            </div>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>1,200+</strong>
            <span>Issues Reported</span>
          </div>

          <div>
            <strong>850+</strong>
            <span>Issues Resolved</span>
          </div>

          <div>
            <strong>25+</strong>
            <span>Communities</span>
          </div>
        </section>

        <section className="features" id="about">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>One platform. A stronger community.</h2>
            <p>
              CivicConnect makes it easier for citizens and authorities to
              work together on local problems.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📢</div>
              <h3>Report Issues</h3>
              <p>
                Report potholes, garbage, broken streetlights, water leaks,
                and other civic problems with photos and location.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Build Community</h3>
              <p>
                Connect with people in your neighbourhood and support issues
                that affect your community.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Track Progress</h3>
              <p>
                Follow your reported issues and see how authorities respond
                and resolve them.
              </p>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Let's make your neighbourhood better.</h2>
          <p>
            Start reporting issues and connect with your community today.
          </p>

          <Link to="/register" className="btn btn-primary">
            Join CivicConnect
          </Link>
        </section>
      </main>

      <footer>
        <p>© 2026 CivicConnect. Building better communities together.</p>
      </footer>
    </>
  );
}


function Issues() {
  return (
    <div className="page-placeholder">
      <h1>Community Issues</h1>
      <p>Reported civic issues will appear here.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

function Report() {
  return (
    <div className="page-placeholder">
      <h1>Report an Issue</h1>
      <p>The issue reporting form will be built next.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

function Community() {
  return (
    <div className="page-placeholder">
      <h1>Community</h1>
      <p>Neighbourhood groups will appear here.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/report" element={<Report />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;