import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function IssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [statusHistory, setStatusHistory] = useState([]);

  const [userRole, setUserRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    setUserRole(payload.role || "");
  } catch (error) {
    console.error("Unable to read user role:", error);
  }
}, []);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError("");

        // =========================
        // Fetch Issue
        // =========================

        const response = await fetch(
          `http://localhost:5000/api/issues/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch issue");
        }

        setIssue(data.issue);

        // =========================
        // Fetch Comments
        // =========================

        const commentsResponse = await fetch(
          `http://localhost:5000/api/issues/${id}/comments`
        );

        const commentsData = await commentsResponse.json();

        if (commentsResponse.ok) {
          setComments(commentsData.comments || []);
        }

        // =========================
        // Fetch Status History
        // =========================

        const historyResponse = await fetch(
          `http://localhost:5000/api/issues/${id}/status-history`
        );

        const historyData = await historyResponse.json();

        if (historyResponse.ok) {
          setStatusHistory(historyData.history || []);
        }
      } catch (error) {
        console.error("Error fetching issue:", error);
        setError(error.message || "Unable to load issue");
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  // =========================
  // Add Comment
  // =========================

  const handleAddComment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to comment on an issue.");
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/issues/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: commentText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to add comment.");
        return;
      }

      setComments((currentComments) => [
        ...currentComments,
        data.comment,
      ]);

      setCommentText("");
    } catch (error) {
      console.error("Comment error:", error);
      alert("Unable to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // =========================
  // Verify Issue
  // =========================

  const handleVerifyIssue = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to verify an issue.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/${issue.id}/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to verify this issue.");
        return;
      }

      setIssue((currentIssue) => ({
        ...currentIssue,
        verification_count: data.verificationCount,
      }));

      alert("Issue verified successfully!");
    } catch (error) {
      console.error("Verification error:", error);
      alert("Unable to verify this issue.");
    }
  };

  // =========================
// Authority Status Update
// =========================

const handleStatusUpdate = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to update the issue status.");
    return;
  }

  if (!selectedStatus) {
    alert("Please select a status.");
    return;
  }

  try {
    setStatusUpdating(true);

    const response = await fetch(
      `http://localhost:5000/api/issues/${issue.id}/status`,
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
      alert(data.message || "Unable to update issue status.");
      return;
    }

    // Update current issue status
    setIssue((currentIssue) => ({
      ...currentIssue,
      status: data.issue.status,
      updated_at: data.issue.updated_at,
    }));

    // Refresh status history
    const historyResponse = await fetch(
      `http://localhost:5000/api/issues/${issue.id}/status-history`
    );

    const historyData = await historyResponse.json();

    if (historyResponse.ok) {
      setStatusHistory(historyData.history || []);
    }

    setSelectedStatus("");
    setStatusComment("");

    alert("Issue status updated successfully!");
  } catch (error) {
    console.error("Status update error:", error);
    alert("Unable to update issue status.");
  } finally {
    setStatusUpdating(false);
  }
};

  // =========================
  // Loading State
  // =========================

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-empty">
            <h2>Loading issue...</h2>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // Error State
  // =========================

  if (error) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-empty">
            <h2>Unable to load issue</h2>

            <p>{error}</p>

            <Link to="/issues" className="btn btn-primary">
              Back to Issues
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">

        {/* Back Link */}

        <Link to="/issues" className="back-link">
          ← Back to Issues
        </Link>

        {/* =========================
            Main Issue Layout
        ========================= */}

        <section className="issue-details">

          {/* =========================
              LEFT COLUMN
          ========================= */}

          <div className="issue-details-main">

            {/* Issue Header */}

            <div className="issue-details-header">

              <div>
                <span className="issue-category">
                  {issue.category}
                </span>

                <h1>{issue.title}</h1>

                <p className="issue-reporter">
                  Reported by {issue.reporter_name}
                </p>
              </div>

              <span
                className={`issue-status ${issue.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {issue.status}
              </span>

            </div>

            {/* Issue Image */}

            {issue.image_url ? (
              <div className="issue-details-image">
                <img
                  src={issue.image_url}
                  alt={issue.title}
                />
              </div>
            ) : (
              <div className="issue-details-no-image">
                No image uploaded for this issue
              </div>
            )}

            {/* Description */}

            <div className="issue-details-section">
              <h2>Description</h2>

              <p>{issue.description}</p>
            </div>

            {/* Location */}

            <div className="issue-details-section">
              <h2>Location</h2>

              <p>
                📍 {issue.address || "Location not provided"}
              </p>

              {issue.neighbourhood_name && (
                <p className="issue-neighbourhood">
                  🏘️ {issue.neighbourhood_name}
                </p>
              )}

              {issue.latitude && issue.longitude && (
                <p className="issue-coordinates">
                  Coordinates: {issue.latitude}, {issue.longitude}
                </p>
              )}
            </div>

            {/* =========================
                Status History
            ========================= */}

            <div className="issue-details-section status-history-section">

              <h2>Status History</h2>

              {statusHistory.length === 0 ? (
                <p className="status-history-empty">
                  No status updates yet.
                </p>
              ) : (
                <div className="status-timeline">

                  {statusHistory.map((entry) => (
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
                            {new Date(
                              entry.changed_at
                            ).toLocaleDateString()}
                          </span>

                        </div>

                        {entry.comment && (
                          <p>
                            {entry.comment}
                          </p>
                        )}

                        <small>
                          Updated by {entry.changed_by_name}
                        </small>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* =========================
                Community Discussion
            ========================= */}

            <div className="issue-details-section comments-section">

              <h2>Community Discussion</h2>

              {comments.length === 0 ? (
                <p className="comments-empty">
                  No comments yet. Be the first to share an update.
                </p>
              ) : (
                <div className="comments-list">

                  {comments.map((comment) => (
                    <div
                      className="comment-item"
                      key={comment.id}
                    >

                      <div className="comment-header">

                        <strong>
                          {comment.user_name}
                        </strong>

                        <span>
                          {new Date(
                            comment.created_at
                          ).toLocaleDateString()}
                        </span>

                      </div>

                      <p>
                        {comment.text}
                      </p>

                    </div>
                  ))}

                </div>
              )}

              <form
                className="comment-form"
                onSubmit={handleAddComment}
              >

                <textarea
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(e.target.value)
                  }
                  placeholder="Share an update or comment about this issue..."
                  rows="4"
                  disabled={commentLoading}
                />

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

              </form>

            </div>

          </div>

          {/* =========================
              RIGHT SIDEBAR
          ========================= */}

          <aside className="issue-details-sidebar">

            {/* Community Support */}

            <div className="issue-info-card">

              <h3>Community Support</h3>

              <div className="support-count-large">
                👍 {issue.support_count}
              </div>

              <p>
                people currently support this issue.
              </p>

              <div className="verification-count">
                🛡️ {issue.verification_count || 0}
              </div>

              <p>
                community members have verified this issue.
              </p>

              <button
                className="btn btn-primary"
                onClick={handleVerifyIssue}
              >
                🛡️ Verify Issue
              </button>

            </div>

            {/* Issue Status */}

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

            </div>

            {/* Authority Actions */}

{(userRole === "AUTHORITY" || userRole === "ADMIN") && (
  <div className="issue-info-card authority-actions-card">

    <h3>Authority Actions</h3>

    <p className="authority-actions-description">
      Update the status of this civic issue and add an official note.
    </p>

    <label className="authority-field-label">
      Change Status
    </label>

    <select
      value={selectedStatus}
      onChange={(e) => setSelectedStatus(e.target.value)}
      className="authority-status-select"
      disabled={statusUpdating}
    >
      <option value="">
        Select new status
      </option>

      <option value="REPORTED">
        Reported
      </option>

      <option value="UNDER REVIEW">
        Under Review
      </option>

      <option value="VERIFIED">
        Verified
      </option>

      <option value="ASSIGNED">
        Assigned
      </option>

      <option value="IN PROGRESS">
        In Progress
      </option>

      <option value="RESOLVED">
        Resolved
      </option>

      <option value="CLOSED">
        Closed
      </option>

      <option value="REJECTED">
        Rejected
      </option>

      <option value="DUPLICATE">
        Duplicate
      </option>
    </select>

    <label className="authority-field-label">
      Authority Note
    </label>

    <textarea
      value={statusComment}
      onChange={(e) => setStatusComment(e.target.value)}
      placeholder="Add a note about this status update..."
      rows="4"
      className="authority-status-comment"
      disabled={statusUpdating}
    />

    <button
      type="button"
      className="btn btn-primary authority-update-btn"
      onClick={handleStatusUpdate}
      disabled={statusUpdating || !selectedStatus}
    >
      {statusUpdating
        ? "Updating..."
        : "Update Status"}
    </button>

  </div>
)}

            {/* Reported Date */}

            <div className="issue-info-card">

              <h3>Reported</h3>

              <p>
                {new Date(
                  issue.created_at
                ).toLocaleDateString()}
              </p>

            </div>

          </aside>

        </section>

      </div>
    </main>
  );
}

export default IssueDetails;

