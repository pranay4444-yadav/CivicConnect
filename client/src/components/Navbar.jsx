import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error reading user data:", error);
      return null;
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch notifications"
        );
      }

      setNotifications(data.notifications);
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error
      );
    }
  };

  fetchNotifications();
}, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  const isAuthority =
    user?.role === "AUTHORITY";

  const isAdmin =
    user?.role === "ADMIN";  


const isCitizen =
  user?.role === "CITIZEN";

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <Link to="/" className="logo">
          <span className="logo-mark">C</span>
          <span>CivicConnect</span>
        </Link>

        {/* Navigation */}

        <nav className="nav-links">
          <Link to="/">
            Home
          </Link>

          <Link to="/issues">
            Issues
          </Link>

          <Link to="/community">
            Community
          </Link>


{isCitizen && (
  <Link to="/my-issues">
    My Issues
  </Link>
)}

          <Link to="/about">
            About
          </Link>

          {isAuthority && (
            <Link to="/authority">
              Authority Dashboard
            </Link>
          )}

          {isAdmin && (
  <Link to="/admin">
    Admin Dashboard
  </Link>
)}
        </nav>


        {/* Actions */}

        <div className="nav-actions">

          {user && (
  <div className="notification-wrapper">
    <button
      type="button"
      className="notification-button"
      title="Notifications"
       onClick={() =>
    setShowNotifications(!showNotifications)
  }
    >
      🔔

      {notifications.filter(
        (notification) => !notification.is_read
      ).length > 0 && (
        <span className="notification-badge">
          {
            notifications.filter(
              (notification) => !notification.is_read
            ).length
          }
        </span>
      )}
    </button>

    {showNotifications && (
  <div className="notification-dropdown">
    <div className="notification-dropdown-header">
      <strong>Notifications</strong>
    </div>

    {notifications.length === 0 ? (
      <div className="notification-empty">
        No notifications yet.
      </div>
    ) : (
      <div className="notification-list">
        {notifications.map((notification) => (
          <div
  key={notification.id}
  className={`notification-item ${
    notification.is_read ? "" : "unread"
  }`}
  onClick={async () => {
    if (notification.is_read) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notifications/${notification.id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark notification as read"
        );
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error
      );
    }
  }}
>
            <p>{notification.message}</p>

            <small>
              {new Date(
                notification.created_at
              ).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    )}
  </div>
)}
  </div>
)}

          {!user ? (
            <>
              <Link
                to="/login"
                className="nav-login"
              >
                Log in
              </Link>

              <Link
                to="/report"
                className="btn btn-primary"
              >
                Report an Issue
              </Link>
            </>
          ) : (
            <>
              <span className="nav-user">
                Hi, {user.name}
              </span>

              {isCitizen && (
      <Link
        to="/report"
        className="btn btn-primary"
      >
        Report an Issue
      </Link>
    )}

              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;