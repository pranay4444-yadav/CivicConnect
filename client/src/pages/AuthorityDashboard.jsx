import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AuthorityDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/issues", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setIssues(data.issues || []);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const totalIssues = issues.length;

  const pendingReview = issues.filter(
    (issue) =>
      issue.status === "REPORTED" ||
      issue.status === "UNDER REVIEW"
  ).length;

  const inProgress = issues.filter(
    (issue) => issue.status === "IN PROGRESS"
  ).length;

  const resolved = issues.filter(
    (issue) =>
      issue.status === "RESOLVED" ||
      issue.status === "CLOSED"
  ).length;

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title?.toLowerCase().includes(search.toLowerCase()) ||
      issue.category?.toLowerCase().includes(search.toLowerCase()) ||
      issue.address?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || issue.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "REPORTED":
        return "status-reported";

      case "UNDER REVIEW":
        return "status-review";

      case "VERIFIED":
        return "status-verified";

      case "ASSIGNED":
        return "status-assigned";

      case "IN PROGRESS":
        return "status-progress";

      case "RESOLVED":
      case "CLOSED":
        return "status-resolved";

      case "REJECTED":
      case "DUPLICATE":
        return "status-rejected";

      default:
        return "status-reported";
    }
  };

  if (loading) {
    return (
      <div className="authority-dashboard">
        <div className="dashboard-loading">
          <p>Loading authority dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="authority-dashboard">

      {/* Header */}
      <div className="authority-header">
        <div>
          <p className="dashboard-eyebrow">
            CIVICCONNECT • AUTHORITY PORTAL
          </p>

          <h1>Authority Dashboard</h1>

          <p className="dashboard-subtitle">
            Monitor, review and manage civic issues reported by citizens.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Issues</span>
            <span className="stat-icon">📋</span>
          </div>

          <strong>{totalIssues}</strong>

          <span className="stat-description">
            All reported civic issues
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Pending Review</span>
            <span className="stat-icon">⏳</span>
          </div>

          <strong>{pendingReview}</strong>

          <span className="stat-description">
            Awaiting authority action
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">In Progress</span>
            <span className="stat-icon">🔧</span>
          </div>

          <strong>{inProgress}</strong>

          <span className="stat-description">
            Currently being handled
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Resolved</span>
            <span className="stat-icon">✓</span>
          </div>

          <strong>{resolved}</strong>

          <span className="stat-description">
            Resolved or closed issues
          </span>
        </div>

      </div>

      {/* Issues Section */}
      <section className="authority-issues-section">

        <div className="section-header">
          <div>
            <h2>Reported Issues</h2>

            <p>
              Review citizen reports and take appropriate action.
            </p>
          </div>

          <span className="issue-count">
            {filteredIssues.length} issues
          </span>
        </div>

        {/* Search + Filter */}
        <div className="authority-controls">

          <div className="issue-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search issues, categories or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="UNDER REVIEW">Under Review</option>
            <option value="VERIFIED">Verified</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

        </div>

        {/* Issues */}
        {filteredIssues.length === 0 ? (

          <div className="empty-issues">
            <div className="empty-icon">📭</div>

            <h3>No issues found</h3>

            <p>
              Try changing your search or status filter.
            </p>
          </div>

        ) : (

          <div className="authority-issues-list">

            {filteredIssues.map((issue) => (

              <div
                className="authority-issue-card"
                key={issue.id}
              >

                <div className="authority-issue-main">

                  <div className="issue-card-heading">

                    <div>
                      <span className="issue-id">
                        ISSUE #{issue.id}
                      </span>

                      <h3>{issue.title}</h3>
                    </div>

                    <span
                      className={`status-badge ${getStatusClass(
                        issue.status
                      )}`}
                    >
                      {issue.status || "REPORTED"}
                    </span>

                  </div>

                  <p className="issue-description">
                    {issue.description}
                  </p>

                  <div className="authority-issue-meta">

                    <span>
                      <strong>Category:</strong>{" "}
                      {issue.category}
                    </span>

                    <span>
                      <strong>Reported by:</strong>{" "}
                      {issue.reporter_name}
                    </span>

                    {issue.address && (
                      <span>
                        <strong>Location:</strong>{" "}
                        {issue.address}
                      </span>
                    )}

                  </div>

                  <div className="issue-community-info">

                    <span>
                      👥 Community Support:{" "}
                      {issue.support_count || 0}
                    </span>

                    <span>
                      ✓ Verified:{" "}
                      {issue.verification_count || 0}
                    </span>

                  </div>

                </div>

                <div className="authority-issue-action">

                  <Link
                    to={`/issues/${issue.id}`}
                    className="view-issue-btn"
                  >
                    View Issue
                    <span>→</span>
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default AuthorityDashboard;

