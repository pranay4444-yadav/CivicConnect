import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    </div>
  );
}

export default AdminDashboard;