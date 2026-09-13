import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Navbar />

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

      <Footer />
    </>
  );
}

export default Home;
