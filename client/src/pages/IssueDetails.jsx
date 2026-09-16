import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

const ISSUE_STATUSES = [
  "REPORTED",
  "UNDER REVIEW",
  "VERIFIED",
  "ASSIGNED",
  "IN PROGRESS",
  "RESOLVED",
  "CLOSED",
  "REJECTED",
  "DUPLICATE",
];

function formatDate(date) {
  if (!date) {
    return "Unknown date";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) {
    return "Unknown date";
  }

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getUserRoleFromToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return "";
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || "";
  } catch (error) {
    console.error("Unable to read user role:", error);
    return "";
  }
}

function IssueDetails() {
  const { id } = useParams();

  // =========================================================
  // Main Issue State
  // =========================================================

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // Community Discussion State
  // =========================================================

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // =========================================================
  // Status History State
  // =========================================================

  const [statusHistory, setStatusHistory] = useState([]);

  // =========================================================
  // Authority State
  // =========================================================

  const [userRole, setUserRole] = useState("");

  const [authorityUsers, setAuthorityUsers] = useState([]);
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [assignmentUpdating, setAssignmentUpdating] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  // =========================================================
  // Permission
  // =========================================================

  const isAuthority =
    userRole === "AUTHORITY" || userRole === "ADMIN";

  // =========================================================
  // Read Current User Role
  // =========================================================

  useEffect(() => {
    setUserRole(getUserRoleFromToken());
  }, []);

  // =========================================================
  // Fetch Issue
  // =========================================================

  const fetchIssue = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/issues/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch issue"
        );
      }

      setIssue(data.issue);

      setSelectedAuthority(
        data.issue.assigned_to
          ? String(data.issue.assigned_to)
          : ""
      );
    } catch (error) {
      console.error("Error fetching issue:", error);

      setError(
        error.message || "Unable to load issue"
      );
    }
  };

  // =========================================================
  // Fetch Comments
  // =========================================================

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/issues/${id}/comments`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch comments"
        );
      }

      setComments(data.comments || []);
    } catch (error) {
      console.error(
        "Error fetching comments:",
        error
      );
    }
  };

  // =========================================================
  // Fetch Status History
  // =========================================================

  const fetchStatusHistory = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/issues/${id}/status-history`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch status history"
        );
      }

      setStatusHistory(data.history || []);
    } catch (error) {
      console.error(
        "Error fetching status history:",
        error
      );
    }
  };

  // =========================================================
  // Fetch Authorities
  // =========================================================

  const fetchAuthorities = async () => {
    if (!isAuthority) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/issues/authorities/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch authorities"
        );
      }

      setAuthorityUsers(
        data.authorities || []
      );
    } catch (error) {
      console.error(
        "Error fetching authorities:",
        error
      );
    }
  };

  // =========================================================
  // Initial Page Load
  // =========================================================

  useEffect(() => {
    const loadIssueData = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          fetchIssue(),
          fetchComments(),
          fetchStatusHistory(),
        ]);
      } catch (error) {
        console.error(
          "Error loading issue page:",
          error
        );

        setError(
          error.message ||
            "Unable to load issue"
        );
      } finally {
        setLoading(false);
      }
    };

    loadIssueData();
  }, [id]);

  // =========================================================
  // Load Authorities
  // =========================================================

  useEffect(() => {
    fetchAuthorities();
  }, [userRole]);

  // =========================================================
  // Add Community Comment
  // =========================================================

  const handleAddComment = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Please log in to comment on an issue."
      );
      return;
    }

    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      return;
    }

    try {
      setCommentLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/issues/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: trimmedComment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to add comment."
        );
        return;
      }

      setComments((currentComments) => [
        ...currentComments,
        data.comment,
      ]);

      setCommentText("");
    } catch (error) {
      console.error(
        "Comment error:",
        error
      );

      alert(
        "Unable to add comment. Please try again."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  // =========================================================
  // Verify Issue
  // =========================================================

  const handleVerifyIssue = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Please log in to verify an issue."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/issues/${id}/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to verify this issue."
        );
        return;
      }

      setIssue((currentIssue) => ({
        ...currentIssue,
        verification_count:
          data.verificationCount,
      }));

      alert(
        "Issue verified successfully!"
      );
    } catch (error) {
      console.error(
        "Verification error:",
        error
      );

      alert(
        "Unable to verify this issue. Please try again."
      );
    }
  };

  // =========================================================
  // Assign Issue
  // =========================================================

  const handleAssignment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Please log in to assign this issue."
      );
      return;
    }

    if (!selectedAuthority) {
      alert(
        "Please select an authority."
      );
      return;
    }

    try {
      setAssignmentUpdating(true);

      const response = await fetch(
        `${API_BASE_URL}/issues/${id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assigned_to:
              Number(selectedAuthority),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to assign issue."
        );
        return;
      }

      setIssue((currentIssue) => ({
        ...currentIssue,
        assigned_to:
          data.issue.assigned_to,
        assigned_authority_name:
          data.assigned_authority.name,
        assigned_authority_email:
          data.assigned_authority.email,
      }));

      alert(
        "Issue assigned successfully!"
      );
    } catch (error) {
      console.error(
        "Assignment error:",
        error
      );

      alert(
        "Unable to assign issue. Please try again."
      );
    } finally {
      setAssignmentUpdating(false);
    }
  };

  // =========================================================
  // Update Issue Status
  // =========================================================

  const handleStatusUpdate = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Please log in to update the issue status."
      );
      return;
    }

    if (!selectedStatus) {
      alert("Please select a status.");
      return;
    }

    try {
      setStatusUpdating(true);

      const response = await fetch(
        `${API_BASE_URL}/issues/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: selectedStatus,
            comment: statusComment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update issue status."
        );
        return;
      }

      setIssue((currentIssue) => ({
        ...currentIssue,
        status: data.issue.status,
        updated_at:
          data.issue.updated_at,
      }));

      await fetchStatusHistory();

      setSelectedStatus("");
      setStatusComment("");

      alert(
        "Issue status updated successfully!"
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Unable to update issue status. Please try again."
      );
    } finally {
      setStatusUpdating(false);
    }
  };

  // =========================================================
  // Loading State
  // =========================================================

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-empty">
            <h2>Loading issue...</h2>
            <p>
              Please wait while we load the
              issue details.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // Error State
  // =========================================================

  if (error || !issue) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-empty">
            <h2>Unable to load issue</h2>

            <p>
              {error ||
                "The requested issue could not be found."}
            </p>

            <Link
              to="/issues"
              className="btn btn-primary"
            >
              Back to Issues
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // Main Page
  // =========================================================

  return (
    <main className="page">
      <div className="container">

        {/* =================================================
            Back Navigation
        ================================================= */}

        <Link
          to="/issues"
          className="back-link"
        >
          ← Back to Issues
        </Link>

        {/* =================================================
            Main Issue Layout
        ================================================= */}

        <section className="issue-details">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="issue-details-main">

            {/* =================================================
                Issue Header
            ================================================= */}

            <div className="issue-details-header">

              <div>
                <span className="issue-category">
                  {issue.category}
                </span>

                <h1>{issue.title}</h1>

                <p className="issue-reporter">
                  Reported by{" "}
                  <strong>
                    {issue.reporter_name}
                  </strong>
                </p>
              </div>

              <span
                className={`issue-status ${issue.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {issue.status}
              </span>

            </div>

            {/* =================================================
                Issue Image
            ================================================= */}

            {issue.image_url ? (
              <div className="issue-details-image">
                <img
                  src={issue.image_url}
                  alt={`Evidence for ${issue.title}`}
                />
              </div>
            ) : (
              <div className="issue-details-no-image">
                <span>📷</span>
                <p>
                  No image uploaded for this
                  issue.
                </p>
              </div>
            )}

            {/* =================================================
                Description
            ================================================= */}

            <section className="issue-details-section">
              <h2>Description</h2>

              <p>
                {issue.description ||
                  "No description provided."}
              </p>
            </section>

            {/* =================================================
                Location
            ================================================= */}

            <section className="issue-details-section">
              <h2>Location</h2>

              <p>
                📍{" "}
                {issue.address ||
                  "Location not provided"}
              </p>

              {issue.neighbourhood_name && (
                <p className="issue-neighbourhood">
                  🏘️{" "}
                  {issue.neighbourhood_name}
                </p>
              )}

              {issue.latitude &&
                issue.longitude && (
                  <p className="issue-coordinates">
                    Coordinates:{" "}
                    {issue.latitude},{" "}
                    {issue.longitude}
                  </p>
                )}
            </section>

            {/* =================================================
                Status History
            ================================================= */}

            <section className="issue-details-section status-history-section">

              <div className="section-heading-row">
                <div>
                  <h2>Status History</h2>

                  <p className="section-subtitle">
                    Track the progress of this
                    issue over time.
                  </p>
                </div>
              </div>

              {statusHistory.length === 0 ? (
                <p className="status-history-empty">
                  No status updates yet.
                </p>
              ) : (
                <div className="status-timeline">

                  {statusHistory.map(
                    (entry) => (
                      <div
                        className="status-timeline-item"
                        key={entry.id}
                      >

                        <div className="status-timeline-dot"></div>

                        <div className="status-timeline-content">

                          <div className="status-timeline-header">

                            <strong>
                              {entry.status}
                            </strong>

                            <span>
                              {formatDateTime(
                                entry.changed_at
                              )}
                            </span>

                          </div>

                          {entry.comment && (
                            <p>
                              {entry.comment}
                            </p>
                          )}

                          <small>
                            Updated by{" "}
                            <strong>
                              {
                                entry.changed_by_name
                              }
                            </strong>
                          </small>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}
            </section>

            {/* =================================================
                Community Discussion
            ================================================= */}

            <section className="issue-details-section comments-section">

              <div className="section-heading-row">
                <div>
                  <h2>
                    Community Discussion
                  </h2>

                  <p className="section-subtitle">
                    Share information,
                    updates, or observations
                    about this issue.
                  </p>
                </div>

                <span className="comments-count">
                  {comments.length}{" "}
                  {comments.length === 1
                    ? "comment"
                    : "comments"}
                </span>
              </div>

              {/* Comments */}

              {comments.length === 0 ? (
                <div className="comments-empty">
                  <span>💬</span>

                  <p>
                    No comments yet. Be the
                    first to share an update.
                  </p>
                </div>
              ) : (
                <div className="comments-list">

                  {comments.map(
                    (comment) => (
                      <div
                        className="comment-item"
                        key={comment.id}
                      >

                        <div className="comment-header">

                          <strong>
                            {comment.user_name}
                          </strong>

                          <span>
                            {formatDate(
                              comment.created_at
                            )}
                          </span>

                        </div>

                        <p>
                          {comment.text}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}

              {/* Add Comment */}

              <form
                className="comment-form"
                onSubmit={handleAddComment}
              >

                <textarea
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(
                      event.target.value
                    )
                  }
                  placeholder="Share an update or comment about this issue..."
                  rows="4"
                  maxLength="1000"
                  disabled={commentLoading}
                  aria-label="Community comment"
                />

                <div className="comment-form-footer">

                  <span>
                    {commentText.length}/1000
                  </span>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      commentLoading ||
                      !commentText.trim()
                    }
                  >
                    {commentLoading
                      ? "Posting..."
                      : "Post Comment"}
                  </button>

                </div>

              </form>

            </section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="issue-details-sidebar">

            {/* =================================================
                Community Support
            ================================================= */}

            <div className="issue-info-card">

              <h3>
                Community Support
              </h3>

              <div className="support-count-large">
                👍{" "}
                {issue.support_count || 0}
              </div>

              <p>
                people currently support
                this issue.
              </p>

              <div className="verification-count">
                🛡️{" "}
                {issue.verification_count ||
                  0}
              </div>

              <p>
                community members have
                verified this issue.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleVerifyIssue}
              >
                🛡️ Verify Issue
              </button>

            </div>

            {/* =================================================
                Current Status
            ================================================= */}

            <div className="issue-info-card">

              <h3>Issue Status</h3>

              <div className="status-item">

                <span className="status-dot"></span>

                <div>
                  <strong>
                    {issue.status}
                  </strong>

                  <p>
                    Current status
                  </p>
                </div>

              </div>

              {issue.updated_at && (
                <p className="status-updated">
                  Last updated{" "}
                  {formatDateTime(
                    issue.updated_at
                  )}
                </p>
              )}

            </div>

            {/* =================================================
                Assigned Authority
            ================================================= */}

            {issue.assigned_authority_name && (
              <div className="issue-info-card assigned-authority-card">

                <h3>
                  Assigned Authority
                </h3>

                <div className="assigned-authority-info">

                  <div className="assigned-authority-icon">
                    👤
                  </div>

                  <div>
                    <strong>
                      {
                        issue.assigned_authority_name
                      }
                    </strong>

                    {issue.assigned_authority_email && (
                      <p>
                        {
                          issue.assigned_authority_email
                        }
                      </p>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                Authority Actions
            ================================================= */}

            {isAuthority && (
              <div className="issue-info-card authority-actions-card">

                {/* Header */}

                <div className="authority-actions-header">

                  <h3>
                    Authority Actions
                  </h3>

                  <p className="authority-actions-description">
                    Manage assignment and
                    official issue updates.
                  </p>

                </div>

                {/* =================================================
                    Assignment
                ================================================= */}

                <div className="authority-action-section">

                  <div className="authority-section-heading">

                    <span className="authority-section-icon">
                      👤
                    </span>

                    <div>
                      <h4>
                        Issue Assignment
                      </h4>

                      <p>
                        Assign this issue to a
                        responsible authority.
                      </p>
                    </div>

                  </div>

                  <label
                    className="authority-field-label"
                    htmlFor="authority-select"
                  >
                    Responsible Authority
                  </label>

                  <div className="authority-assignment-row">

                    <select
                      id="authority-select"
                      value={
                        selectedAuthority
                      }
                      onChange={(event) =>
                        setSelectedAuthority(
                          event.target.value
                        )
                      }
                      className="authority-status-select"
                      disabled={
                        assignmentUpdating
                      }
                    >

                      <option value="">
                        Select authority
                      </option>

                      {authorityUsers.map(
                        (authority) => (
                          <option
                            key={
                              authority.id
                            }
                            value={
                              authority.id
                            }
                          >
                            {
                              authority.name
                            }
                          </option>
                        )
                      )}

                    </select>

                    <button
                      type="button"
                      className="btn btn-primary authority-assignment-btn"
                      onClick={
                        handleAssignment
                      }
                      disabled={
                        assignmentUpdating ||
                        !selectedAuthority
                      }
                    >
                      {assignmentUpdating
                        ? "Assigning..."
                        : "Assign Issue"}
                    </button>

                  </div>

                </div>

                <div className="authority-action-divider"></div>

                {/* =================================================
                    Status Update
                ================================================= */}

                <div className="authority-action-section">

                  <div className="authority-section-heading">

                    <span className="authority-section-icon">
                      ⚙️
                    </span>

                    <div>
                      <h4>
                        Update Issue Status
                      </h4>

                      <p>
                        Record the latest
                        progress on this issue.
                      </p>
                    </div>

                  </div>

                  <label
                    className="authority-field-label"
                    htmlFor="status-select"
                  >
                    New Status
                  </label>

                  <select
                    id="status-select"
                    value={selectedStatus}
                    onChange={(event) =>
                      setSelectedStatus(
                        event.target.value
                      )
                    }
                    className="authority-status-select"
                    disabled={
                      statusUpdating
                    }
                  >

                    <option value="">
                      Select new status
                    </option>

                    {ISSUE_STATUSES.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}

                  </select>

                  <label
                    className="authority-field-label"
                    htmlFor="status-comment"
                  >
                    Official Note
                  </label>

                  <textarea
                    id="status-comment"
                    value={statusComment}
                    onChange={(event) =>
                      setStatusComment(
                        event.target.value
                      )
                    }
                    placeholder="Add an official note about this update..."
                    rows="3"
                    maxLength="500"
                    className="authority-status-comment"
                    disabled={
                      statusUpdating
                    }
                  />

                  <div className="authority-comment-count">
                    {statusComment.length}/500
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary authority-update-btn"
                    onClick={
                      handleStatusUpdate
                    }
                    disabled={
                      statusUpdating ||
                      !selectedStatus
                    }
                  >
                    {statusUpdating
                      ? "Updating..."
                      : "Update Status"}
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                Reported Information
            ================================================= */}

            <div className="issue-info-card reported-info-card">

              <h3>Reported</h3>

              <div className="reported-date">

                <span className="reported-date-icon">
                  📅
                </span>

                <span>
                  {formatDate(
                    issue.created_at
                  )}
                </span>

              </div>

              <p className="reported-by-text">
                This issue was reported by{" "}
                <strong>
                  {issue.reporter_name}
                </strong>
              </p>

            </div>

          </aside>
        </section>
      </div>
    </main>
  );
}

export default IssueDetails;