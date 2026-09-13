import './App.css'

function App() {
  return (
    <div className="app">
      {/* Navigation */}
      <header className="navbar">
        <div className="logo">
          <span className="logo-mark">C</span>
          <span>CivicConnect</span>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#issues">Issues</a>
          <a href="#community">Community</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <button className="login-btn">Log in</button>
          <button className="signup-btn">Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="hero-badge">
              <span>●</span> Making communities better, together
            </div>

            <h1>
              Your voice can
              <span> change your community.</span>
            </h1>

            <p>
              Report local problems, connect with your neighbours, and work
              together to make your neighbourhood a better place.
            </p>

            <div className="hero-actions">
              <button className="primary-btn">
                Report an Issue <span>→</span>
              </button>

              <button className="secondary-btn">
                Explore Issues
              </button>
            </div>

            <div className="hero-stats">
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
            </div>
          </div>

          <div className="hero-visual">
            <div className="map-card">
              <div className="map-header">
                <div>
                  <strong>Community Issues</strong>
                  <span>Nearby reports</span>
                </div>

                <div className="map-status">
                  <span></span> Live
                </div>
              </div>

              <div className="fake-map">
                <div className="road road-one"></div>
                <div className="road road-two"></div>
                <div className="road road-three"></div>

                <div className="map-pin pin-one">!</div>
                <div className="map-pin pin-two">!</div>
                <div className="map-pin pin-three">✓</div>
                <div className="map-pin pin-four">!</div>

                <div className="map-location">
                  <span></span>
                  Your neighbourhood
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features-section" id="community">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>Small reports can create big changes.</h2>
            <p>
              CivicConnect brings citizens and local authorities together
              to solve everyday community problems.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon report-icon">+</div>
              <h3>Report Issues</h3>
              <p>
                Spotted a pothole, garbage problem, broken streetlight, or
                water leak? Report it with a photo and location.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon community-icon">♧</div>
              <h3>Build Community</h3>
              <p>
                Connect with people in your neighbourhood and support
                genuine issues affecting your community.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon track-icon">✓</div>
              <h3>Track Progress</h3>
              <p>
                Follow your report from submission to resolution and see
                how local authorities respond.
              </p>
            </article>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section" id="about">
          <div>
            <span>YOUR COMMUNITY. YOUR VOICE.</span>
            <h2>Let's make your neighbourhood better.</h2>
            <p>
              Join CivicConnect and become an active part of your local
              community.
            </p>
          </div>

          <button className="primary-btn">
            Join CivicConnect <span>→</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          <span className="logo-mark">C</span>
          <span>CivicConnect</span>
        </div>

        <p>Connecting citizens. Improving communities.</p>

        <span>© 2026 CivicConnect</span>
      </footer>
    </div>
  )
}

export default App