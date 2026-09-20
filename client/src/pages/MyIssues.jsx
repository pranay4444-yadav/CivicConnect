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

        setIssues(data.issues);
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

      <main className="issues-page">
        <section className="issues-header">
          <div>
            <span className="section-badge">
              My Issues
            </span>

            <h1>Issues reported by you</h1>

            <p>
              Track the civic issues you have reported and
              follow their progress.
            </p>
          </div>

          <Link
            to="/report"
            className="btn btn-primary"
          >
            + Report an Issue
          </Link>
        </section>

        <section className="issues-results">
          <div className="results-header">
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
              Your reported issues
            </span>
          </div>

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
            <div className="no-issues">
              <div className="no-issues-icon">
                ⚠️
              </div>

              <h3>Unable to load your issues</h3>

              <p>{error}</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="no-issues">
              <div className="no-issues-icon">
                📋
              </div>

              <h3>No issues reported yet</h3>

              <p>
                You haven't reported any civic issues yet.
              </p>

              <Link
                to="/report"
                className="btn btn-primary"
              >
                Report Your First Issue
              </Link>
            </div>
          ) : (
            <div className="issues-grid">
              {issues.map((issue) => (
                <Link
                  key={issue.id}
                  to={`/issues/${issue.id}`}
                  className="my-issue-card"
                >
                  <div className="my-issue-card-content">
                    <span className="issue-category">
                      {issue.category}
                    </span>

                    <h3>{issue.title}</h3>

                    <p>{issue.description}</p>

                    <div className="my-issue-meta">
                      <span>
                        📍{" "}
                        {issue.address ||
                          "Location not provided"}
                      </span>

                      <span>
                        {formatStatus(issue.status)}
                      </span>
                    </div>
                  </div>
                </Link>
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