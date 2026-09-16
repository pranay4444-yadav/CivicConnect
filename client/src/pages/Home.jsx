import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main className="home-page">

        {/* =================================================
            Hero Section
        ================================================= */}

        <section className="hero-section">
          <div className="container hero-container">

            <div className="hero-content">

              <span className="hero-badge">
                🏙️ Building better communities together
              </span>

              <h1>
                Report local issues.
                <br />
                <span>Make your community better.</span>
              </h1>

              <p>
                CivicConnect gives citizens a simple way to report
                civic problems, connect with their neighbourhood,
                and follow issues from report to resolution.
              </p>

              <div className="hero-actions">

                <Link
                  to="/report"
                  className="btn btn-primary hero-button"
                >
                  Report an Issue →
                </Link>

                <Link
                  to="/issues"
                  className="btn btn-secondary hero-button"
                >
                  Explore Issues
                </Link>

              </div>

              <div className="hero-trust">

                <span>
                  ✓ Easy to report
                </span>

                <span>
                  ✓ Community verified
                </span>

                <span>
                  ✓ Track progress
                </span>

              </div>

            </div>

            {/* =================================================
                Hero Visual
            ================================================= */}

            <div
              className="hero-visual"
              aria-label="Community issue map preview"
            >

              <div className="hero-map-card">

                <div className="map-top">

                  <div>
                    <strong>
                      Community Issues
                    </strong>

                    <span>
                      Nearby civic problems
                    </span>
                  </div>

                  <span className="map-status">
                    LIVE
                  </span>

                </div>

                <div className="fake-map">

                  <div className="map-road road-1"></div>
                  <div className="map-road road-2"></div>
                  <div className="map-road road-3"></div>

                  <div
                    className="map-marker marker-1"
                    aria-label="Issue location"
                  >
                    📍
                  </div>

                  <div
                    className="map-marker marker-2"
                    aria-label="Issue location"
                  >
                    📍
                  </div>

                  <div
                    className="map-marker marker-3"
                    aria-label="Issue location"
                  >
                    📍
                  </div>

                  <div className="map-location">

                    <strong>
                      12 active issues
                    </strong>

                    <span>
                      in your community
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            Platform Stats
        ================================================= */}

        <section
          className="stats-section"
          aria-label="CivicConnect statistics"
        >

          <div className="container stats-grid">

            <div className="stat-card">
              <strong>1,250+</strong>
              <span>Issues Reported</span>
            </div>

            <div className="stat-card">
              <strong>840+</strong>
              <span>Issues Resolved</span>
            </div>

            <div className="stat-card">
              <strong>35+</strong>
              <span>Neighbourhoods</span>
            </div>

            <div className="stat-card">
              <strong>4,500+</strong>
              <span>Citizens Connected</span>
            </div>

          </div>

        </section>

        {/* =================================================
            How CivicConnect Works
        ================================================= */}

        <section className="section">

          <div className="container">

            <div className="section-header centered">

              <span className="section-label">
                HOW IT WORKS
              </span>

              <h2>
                From problem to solution
              </h2>

              <p>
                CivicConnect makes it simple for citizens to bring
                local problems to attention and work together
                toward solutions.
              </p>

            </div>

            <div className="steps-grid">

              {/* Step 1 */}

              <article className="step-card">

                <div className="step-number">
                  01
                </div>

                <div
                  className="step-icon"
                  aria-hidden="true"
                >
                  📸
                </div>

                <h3>
                  Report an issue
                </h3>

                <p>
                  Take a photo, describe the problem and mark
                  its location so your community can understand
                  what needs attention.
                </p>

              </article>

              {/* Step 2 */}

              <article className="step-card">

                <div className="step-number">
                  02
                </div>

                <div
                  className="step-icon"
                  aria-hidden="true"
                >
                  🤝
                </div>

                <h3>
                  Get community support
                </h3>

                <p>
                  Nearby residents can support, verify and
                  discuss reports that affect their
                  neighbourhood.
                </p>

              </article>

              {/* Step 3 */}

              <article className="step-card">

                <div className="step-number">
                  03
                </div>

                <div
                  className="step-icon"
                  aria-hidden="true"
                >
                  🏛️
                </div>

                <h3>
                  Track resolution
                </h3>

                <p>
                  Follow the issue as authorities review,
                  assign and work on it until progress is
                  recorded.
                </p>

              </article>

            </div>

          </div>

        </section>

        {/* =================================================
            Neighbourhood Community
        ================================================= */}

        <section className="community-section">

          <div className="container community-container">

            <div className="community-content">

              <span className="section-label">
                YOUR NEIGHBOURHOOD
              </span>

              <h2>
                Your community has a voice.
              </h2>

              <p>
                Join your neighbourhood community, discuss
                local problems and help verify issues reported
                by people around you.
              </p>

              <Link
                to="/community"
                className="btn btn-primary"
              >
                Explore Community →
              </Link>

            </div>

            {/* Community Preview */}

            <div className="community-card">

              <div className="community-card-header">

                <div
                  className="community-avatar"
                  aria-hidden="true"
                >
                  N
                </div>

                <div>

                  <strong>
                    Neighbourhood Community
                  </strong>

                  <span>
                    1,248 members
                  </span>

                </div>

              </div>

              <div className="community-issue">

                <span
                  className="issue-dot"
                  aria-hidden="true"
                ></span>

                <div>

                  <strong>
                    Large pothole near main road
                  </strong>

                  <span>
                    23 residents support this issue
                  </span>

                </div>

              </div>

              <div className="community-issue">

                <span
                  className="issue-dot"
                  aria-hidden="true"
                ></span>

                <div>

                  <strong>
                    Streetlight not working
                  </strong>

                  <span>
                    16 residents support this issue
                  </span>

                </div>

              </div>

              <div className="community-footer">

                <span>
                  ✓ Community verified
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            Final Call To Action
        ================================================= */}

        <section className="cta-section">

          <div className="container cta-container">

            <span className="section-label">
              MAKE A DIFFERENCE
            </span>

            <h2>
              See a problem in your community?
            </h2>

            <p>
              Report it today and help make your
              neighbourhood better.
            </p>

            <Link
              to="/report"
              className="btn btn-primary cta-button"
            >
              Report an Issue →
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Home;