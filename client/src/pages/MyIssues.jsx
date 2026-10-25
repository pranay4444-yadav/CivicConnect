import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function formatStatus(status) {
  if (!status) return "Reported";

  return status
    .toLowerCase()
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/issues/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch your issues"
          );
        }

        setIssues(data.issues || []);
      } catch (error) {
        console.error("Error fetching my issues:", error);

        setError(
          error.message || "Unable to load your issues."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyIssues();
  }, []);

  return (
    <div>
      <Navbar />

      <main className="issues-page my-issues-page">

        {/* =============================================
            Header
        ============================================== */}

        <section className="issues-header my-issues-header">

          <div>
            <span className="section-badge">
              My Issues
            </span>

            <h1>Issues reported by you</h1>

            <p>
              Track your civic reports, follow their progress
              and see how authorities respond.
            </p>
          </div>

          <Link
            to="/report"
            className="btn btn-primary"
          >
            + Report an Issue
          </Link>

        </section>

        {/* =============================================
            Results
        ============================================== */}

        <section className="issues-results">

          <div className="results-header">

            <div>
              <h2>
                {loading
                  ? "Loading..."
                  : `${issues.length} ${
                      issues.length === 1
                        ? "Issue"
                        : "Issues"
                    }`}
              </h2>

              <span>
                Your reported civic issues
              </span>
            </div>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="no-issues">

              <div className="no-issues-icon">
                ⏳
              </div>

              <h3>Loading your issues...</h3>

              <p>
                We're getting your reported issues.
              </p>

            </div>
          ) : error ? (

            /* Error */

            <div className="no-issues">

              <div className="no-issues-icon">
                ⚠️
              </div>

              <h3>Unable to load your issues</h3>

              <p>{error}</p>

            </div>
          ) : issues.length === 0 ? (

            /* Empty */

            <div className="no-issues">

              <div className="no-issues-icon">
                📋
              </div>

              <h3>No issues reported yet</h3>

              <p>
                You haven't reported any civic issues yet.
                Report a problem in your area to get started.
              </p>

              <Link
                to="/report"
                className="btn btn-primary"
              >
                Report Your First Issue
              </Link>

            </div>
          ) : (

            /* =============================================
                Issue Cards
            ============================================== */

            <div className="my-issues-grid">

              {issues.map((issue) => (
                <article
                  key={issue.id}
                  className="my-issue-card"
                >

                  {/* Image */}

                  {issue.image_url ? (
                    <Link
                      to={`/issues/${issue.id}`}
                      className="my-issue-image"
                    >
                      <img
                        src={issue.image_url}
                        alt={`Evidence for ${issue.title}`}
                      />
                    </Link>
                  ) : (
                    <Link
                      to={`/issues/${issue.id}`}
                      className="my-issue-image my-issue-no-image"
                    >
                      <span>📷</span>

                      <small>
                        No photo
                      </small>
                    </Link>
                  )}

                  {/* Content */}

                  <div className="my-issue-card-content">

                    {/* Category + Status */}

                    <div className="my-issue-card-top">

                      <span className="issue-category">
                        {issue.category || "Other"}
                      </span>

                      <span
                        className={`issue-status ${
                          issue.status
                            ? issue.status
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            : "reported"
                        }`}
                      >
                        {formatStatus(issue.status)}
                      </span>

                    </div>

                    {/* Title */}

                    <Link
                      to={`/issues/${issue.id}`}
                      className="my-issue-title"
                    >
                      <h3>{issue.title}</h3>
                    </Link>

                    {/* Description */}

                    <p className="my-issue-description">
                      {issue.description ||
                        "No description provided."}
                    </p>

                    {/* Location */}

                    <div className="my-issue-location">
                      <span>📍</span>

                      <span>
                        {issue.address ||
                          "Location not provided"}
                      </span>
                    </div>

                    {/* Footer */}

                    <div className="my-issue-card-footer">

                      <div className="my-issue-date">
                        {issue.created_at && (
                          <>
                            <span>📅</span>

                            <span>
                              Reported{" "}
                              {formatDate(
                                issue.created_at
                              )}
                            </span>
                          </>
                        )}
                      </div>

                      <Link
                        to={`/issues/${issue.id}`}
                        className="my-issue-view-link"
                      >
                        View Details →
                      </Link>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>

      <Footer />
    </div>
  );
}

export default MyIssues;