import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

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

            {/* Hero Content */}

            <div className="hero-content">

              <span className="hero-badge">
                🏙️ Building better communities together
              </span>

              <h1>
                Report local issues.
                <br />
                <span>
                  Make your community better.
                </span>
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
                Hero Map
            ================================================= */}

            <div
              className="hero-visual"
              aria-label="Community issue map preview"
            >

              <div className="hero-map-card">

                {/* Map Header */}

                <div className="map-top">

                  <div>
                    <strong>
                      Community Issues
                    </strong>

                    <span>
                      Explore civic problems reported nearby
                    </span>
                  </div>

                  <span className="map-status">
                    ● LIVE
                  </span>

                </div>

                {/* Real OpenStreetMap */}

                <div className="hero-real-map">

                  <MapContainer
                    center={[12.9716, 77.5946]}
                    zoom={12}
                    scrollWheelZoom={false}
                    dragging={false}
                    zoomControl={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                    keyboard={false}
                    className="hero-leaflet-map"
                  >

                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Sample Issue Marker 1 */}

                    <CircleMarker
                      center={[
                        12.9716,
                        77.5946,
                      ]}
                      radius={9}
                    >
                      <Popup>
                        <strong>
                          Civic issue
                        </strong>

                        <br />

                        Issue reported by the community.
                      </Popup>
                    </CircleMarker>

                    {/* Sample Issue Marker 2 */}

                    <CircleMarker
                      center={[
                        13.0055,
                        77.5692,
                      ]}
                      radius={9}
                    >
                      <Popup>
                        <strong>
                          Road issue
                        </strong>

                        <br />

                        Road problem reported nearby.
                      </Popup>
                    </CircleMarker>

                    {/* Sample Issue Marker 3 */}

                    <CircleMarker
                      center={[
                        13.0358,
                        77.597,
                      ]}
                      radius={9}
                    >
                      <Popup>
                        <strong>
                          Community issue
                        </strong>

                        <br />

                        Civic problem reported by residents.
                      </Popup>
                    </CircleMarker>

                  </MapContainer>

                  {/* Map Information */}

                  <div className="hero-map-summary">

                    <div>
                      <strong>
                        Explore reported issues
                      </strong>

                      <span>
                        See civic problems reported by
                        the community
                      </span>
                    </div>

                    <Link
                      to="/issues"
                      className="hero-map-link"
                    >
                      View Issues →
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            Platform Highlights
        ================================================= */}

        <section
          className="stats-section"
          aria-label="CivicConnect platform features"
        >

          <div className="container stats-grid">

            <div className="stat-card">

              <strong>
                📍
              </strong>

              <span>
                Location-Based Reporting
              </span>

            </div>

            <div className="stat-card">

              <strong>
                🛡️
              </strong>

              <span>
                Community Verification
              </span>

            </div>

            <div className="stat-card">

              <strong>
                🏘️
              </strong>

              <span>
                Neighbourhood Communities
              </span>

            </div>

            <div className="stat-card">

              <strong>
                🔔
              </strong>

              <span>
                Status Notifications
              </span>

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
                    Connect with residents nearby
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
                    Report local problems
                  </strong>

                  <span>
                    Share issues affecting your area
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
                    Verify community reports
                  </strong>

                  <span>
                    Help confirm genuine civic issues
                  </span>

                </div>

              </div>

              <div className="community-footer">

                <span>
                  ✓ Community powered
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