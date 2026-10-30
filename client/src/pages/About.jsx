import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        {/* Hero */}
        <section className="about-hero">
          <div className="about-hero-inner">
            <span className="section-eyebrow">About CivicConnect</span>

            <h1>
              Connecting citizens with their
              <span> community.</span>
            </h1>

            <p>
              CivicConnect is a community-based civic issue reporting and
              management platform designed to make it easier for citizens to
              report local problems, follow their progress, and participate in
              improving their neighbourhoods.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="about-content">
          <div className="about-intro">
            <div>
              <span className="section-eyebrow">Our Purpose</span>

              <h2>A simpler way to report and track civic issues</h2>
            </div>

            <p>
              Problems such as potholes, garbage accumulation, damaged
              streetlights, water leakage, and drainage issues can affect
              everyday life. CivicConnect provides one platform where citizens
              can report these issues with useful information such as
              descriptions, photographs, and locations.
            </p>
          </div>

          {/* Features */}
          <div className="about-feature-grid">
            <article className="about-feature-card">
              <div className="about-feature-icon">📍</div>

              <h3>Report Local Issues</h3>

              <p>
                Citizens can report civic problems with a description, image,
                category, and location to provide clear information about the
                issue.
              </p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-icon">🔎</div>

              <h3>Track Progress</h3>

              <p>
                Reported issues can be viewed and tracked as they move through
                different stages from reporting to resolution.
              </p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-icon">🤝</div>

              <h3>Community Participation</h3>

              <p>
                Citizens can support reports, verify local issues, participate
                in discussions, and connect through neighbourhood communities.
              </p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-icon">🏛️</div>

              <h3>Authority Management</h3>

              <p>
                Authorities can review assigned civic issues and update their
                status so citizens can follow the progress of reported
                problems.
              </p>
            </article>
          </div>

          {/* How platform connects users */}
          <div className="about-workflow">
            <div className="about-workflow-heading">
              <span className="section-eyebrow">How It Connects</span>

              <h2>Citizens, communities, and authorities</h2>

              <p>
                CivicConnect brings the main participants in civic issue
                management together through a shared platform.
              </p>
            </div>

            <div className="about-role-grid">
              <div className="about-role-card">
                <span className="about-role-number">01</span>

                <h3>Citizens</h3>

                <p>
                  Report issues, provide evidence, select locations, support
                  reports, verify issues, comment, and track progress.
                </p>
              </div>

              <div className="about-role-card">
                <span className="about-role-number">02</span>

                <h3>Authorities</h3>

                <p>
                  Review civic reports, manage assigned issues, and update
                  their status as work progresses.
                </p>
              </div>

              <div className="about-role-card">
                <span className="about-role-number">03</span>

                <h3>Administrators</h3>

                <p>
                  Monitor the platform, users, civic issues, roles, and
                  neighbourhood activity through the administration
                  dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="about-tech">
            <div className="about-tech-content">
              <span className="section-eyebrow">Technology</span>

              <h2>Built as a full-stack web platform</h2>

              <p>
                CivicConnect combines a modern frontend with a REST API,
                relational database, authentication, image handling, and
                interactive maps.
              </p>
            </div>

            <div className="about-tech-list">
              <span>React</span>
              <span>Node.js</span>
              <span>Express</span>
              <span>PostgreSQL</span>
              <span>JWT</span>
              <span>Leaflet</span>
              <span>OpenStreetMap</span>
              <span>Cloudinary</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;