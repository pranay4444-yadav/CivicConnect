import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleStatusChange = async (issueId, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/issues/${issueId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update issue status"
      );
    }

    console.log("Status updated successfully:", data);

    setIssues((currentIssues) =>
  currentIssues.map((issue) =>
    issue.id === issueId
      ? { ...issue, status: newStatus }
      : issue
  )
);

  } catch (error) {
    console.error("Error updating issue status:", error);
  }
};

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load statistics"
          );
        }

        setStats(data.stats);

        const issuesResponse = await fetch(
  "http://localhost:5000/api/admin/issues",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const issuesData = await issuesResponse.json();

if (!issuesResponse.ok) {
  throw new Error(
    issuesData.message || "Failed to load issues"
  );
}

setIssues(issuesData.issues);

      } catch (error) {
        console.error("Error loading admin statistics:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage CivicConnect and monitor civic activity.</p>
      </div>

      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card users-card">
            <h3>Total Users</h3>
            <p>{stats.total_users}</p>
          </div>

          <div className="admin-stat-card issues-card">
            <h3>Total Issues</h3>
            <p>{stats.total_issues}</p>
          </div>

          <div className="admin-stat-card neighbourhood-card">
            <h3>Neighbourhoods</h3>
            <p>{stats.total_neighbourhoods}</p>
          </div>

          <div className="admin-stat-card open-card">
            <h3>Open Issues</h3>
            <p>{stats.open_issues}</p>
          </div>
        </div>
      )}
      <div className="admin-issues-section">
  <div className="admin-section-header">
    <h2>Reported Issues</h2>
    <p>Review and manage civic issues reported by citizens.</p>
  </div>

  <div className="admin-issues-table-wrapper">
    <table className="admin-issues-table">
      <thead>
        <tr>
          <th>Issue</th>
          <th>Category</th>
          <th>Status</th>
          <th>Reported By</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {issues.map((issue) => (
          <tr key={issue.id}>
            <td>
              <strong>{issue.title}</strong>
              <span>{issue.description}</span>
            </td>

            <td>{issue.category}</td>

            <td>
  <select
    className="admin-status-select"
    value={issue.status}
    onChange={(event) => {
  handleStatusChange(issue.id, event.target.value);
}}
  >
    <option value="REPORTED">REPORTED</option>
    <option value="UNDER REVIEW">UNDER REVIEW</option>
    <option value="VERIFIED">VERIFIED</option>
    <option value="ASSIGNED">ASSIGNED</option>
    <option value="IN PROGRESS">IN PROGRESS</option>
    <option value="RESOLVED">RESOLVED</option>
    <option value="CLOSED">CLOSED</option>
    <option value="REJECTED">REJECTED</option>
    <option value="DUPLICATE">DUPLICATE</option>
  </select>
</td>

            <td>{issue.reporter_name || "Unknown"}</td>

            <td>
  {new Date(issue.created_at).toLocaleDateString()}
</td>

<td>
  <Link
    to={`/issues/${issue.id}`}
    className="admin-view-button"
  >
    View
  </Link>
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
}

export default AdminDashboard;