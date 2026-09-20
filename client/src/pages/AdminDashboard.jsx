import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [neighbourhoods, setNeighbourhoods] = useState([]);
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update user role"
        );
      }

      console.log("Role updated successfully:", data);

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? { ...user, role: newRole }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
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

        const usersResponse = await fetch(
          "http://localhost:5000/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const usersData = await usersResponse.json();

        if (!usersResponse.ok) {
          throw new Error(
            usersData.message || "Failed to load users"
          );
        }

        setUsers(usersData.users);

        const neighbourhoodsResponse = await fetch(
  "http://localhost:5000/api/admin/neighbourhoods",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const neighbourhoodsData = await neighbourhoodsResponse.json();

if (!neighbourhoodsResponse.ok) {
  throw new Error(
    neighbourhoodsData.message ||
      "Failed to load neighbourhoods"
  );
}

setNeighbourhoods(neighbourhoodsData.neighbourhoods);
      } catch (error) {
        console.error(
          "Error loading admin dashboard:",
          error
        );

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
        <p>
          Manage CivicConnect and monitor civic activity.
        </p>
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

      {/* Reported Issues */}

      <div className="admin-issues-section">
        <div className="admin-section-header">
          <h2>Reported Issues</h2>
          <p>
            Review and manage civic issues reported by
            citizens.
          </p>
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
                        handleStatusChange(
                          issue.id,
                          event.target.value
                        );
                      }}
                    >
                      <option value="REPORTED">
                        REPORTED
                      </option>

                      <option value="UNDER REVIEW">
                        UNDER REVIEW
                      </option>

                      <option value="VERIFIED">
                        VERIFIED
                      </option>

                      <option value="ASSIGNED">
                        ASSIGNED
                      </option>

                      <option value="IN PROGRESS">
                        IN PROGRESS
                      </option>

                      <option value="RESOLVED">
                        RESOLVED
                      </option>

                      <option value="CLOSED">
                        CLOSED
                      </option>

                      <option value="REJECTED">
                        REJECTED
                      </option>

                      <option value="DUPLICATE">
                        DUPLICATE
                      </option>
                    </select>
                  </td>

                  <td>
                    {issue.reporter_name || "Unknown"}
                  </td>

                  <td>
                    {new Date(
                      issue.created_at
                    ).toLocaleDateString()}
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

      {/* Registered Users */}

      <div className="admin-users-section">
        <div className="admin-section-header">
          <h2>Registered Users</h2>
          <p>
            View users and their roles on CivicConnect.
          </p>
        </div>

        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <select
                      className={`admin-user-role-select ${user.role.toLowerCase()}`}
                      value={user.role}
                      onChange={(event) => {
                        handleRoleChange(
                          user.id,
                          event.target.value
                        );
                      }}
                    >
                      <option value="CITIZEN">
                        CITIZEN
                      </option>

                      <option value="AUTHORITY">
                        AUTHORITY
                      </option>

                      <option value="ADMIN">
                        ADMIN
                      </option>
                    </select>
                  </td>

                  <td>
                    {new Date(
                      user.created_at
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
            {/* Neighbourhoods */}

      <div className="admin-neighbourhoods-section">
        <div className="admin-section-header">
          <h2>Neighbourhoods</h2>
          <p>
            Monitor neighbourhood communities and their activity.
          </p>
        </div>

        <div className="admin-neighbourhoods-grid">
          {neighbourhoods.map((neighbourhood) => (
            <div
              className="admin-neighbourhood-card"
              key={neighbourhood.id}
            >
              <h3>{neighbourhood.name}</h3>

              <p className="admin-neighbourhood-description">
                {neighbourhood.description ||
                  "No description provided."}
              </p>

              <div className="admin-neighbourhood-details">
                <div>
                  <span>Created By</span>
                  <strong>
                    {neighbourhood.created_by_name ||
                      "Unknown"}
                  </strong>
                </div>

                <div>
                  <span>Members</span>
                  <strong>
                    {neighbourhood.member_count}
                  </strong>
                </div>

                <div>
                  <span>Issues</span>
                  <strong>
                    {neighbourhood.issue_count}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;