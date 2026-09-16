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

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/issues/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch issue");
        }

        setIssue(data.issue);

        const commentsResponse = await fetch(
         `http://localhost:5000/api/issues/${id}/comments`
        );

        const commentsData = await commentsResponse.json();

        if (commentsResponse.ok) {
          setComments(commentsData.comments || []);
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

        <Link to="/issues" className="back-link">
          ← Back to Issues
        </Link>

        <section className="issue-details">

          <div className="issue-details-main">

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

            <div className="issue-details-section">
              <h2>Description</h2>
              <p>{issue.description}</p>
            </div>

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

          </div>

          <div className="issue-details-section comments-section">
  <h2>Community Discussion</h2>

  {comments.length === 0 ? (
    <p className="comments-empty">
      No comments yet. Be the first to share an update.
    </p>
  ) : (
    <div className="comments-list">
      {comments.map((comment) => (
        <div className="comment-item" key={comment.id}>
          <div className="comment-header">
            <strong>{comment.user_name}</strong>
            <span>
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>

          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  )}

  <form className="comment-form" onSubmit={handleAddComment}>
    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Share an update or comment about this issue..."
      rows="4"
      disabled={commentLoading}
    />

    <button
      type="submit"
      className="btn btn-primary"
      disabled={commentLoading || !commentText.trim()}
    >
      {commentLoading ? "Posting..." : "Post Comment"}
    </button>
  </form>
</div>
          <aside className="issue-details-sidebar">

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
                onClick={async () => {
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
              }}
              >
             🛡️ Verify Issue
            </button>
            </div>

            <div className="issue-info-card">
              <h3>Issue Status</h3>

              <div className="status-item">
                <span className="status-dot"></span>
                <div>
                  <strong>{issue.status}</strong>
                  <p>Current status</p>
                </div>
              </div>
            </div>

            <div className="issue-info-card">
              <h3>Reported</h3>

              <p>
                {new Date(issue.created_at).toLocaleDateString()}
              </p>
            </div>

          </aside>

        </section>

      </div>
    </main>
  );
}

export default IssueDetails;