import { useState } from "react";
import { Link } from "react-router-dom";

function IssueCard({ issue }) {
  const [supportCount, setSupportCount] = useState(issue.supports || 0);
  const [supporting, setSupporting] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  const handleSupport = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to support an issue.");
      return;
    }

    try {
      setSupporting(true);
      setSupportMessage("");

      const response = await fetch(
        `http://localhost:5000/api/issues/${issue.id}/support`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSupportMessage(data.message || "Unable to support this issue.");
        return;
      }

      setSupportCount(data.supportCount);
      setSupportMessage("Supported ✓");
    } catch (error) {
      console.error("Support error:", error);
      setSupportMessage("Unable to support this issue.");
    } finally {
      setSupporting(false);
    }
  };

  return (
    <article className="issue-card">
      <div className="issue-image">
        <img src={issue.image} alt={issue.title} />

        <span
          className={`issue-status ${issue.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {issue.status}
        </span>
      </div>

      <div className="issue-content">
        <span className="issue-category">{issue.category}</span>

        <h3>{issue.title}</h3>

        <p className="issue-description">
          {issue.description}
        </p>

        <div className="issue-location">
          📍 {issue.location}
        </div>

        <div className="issue-meta">

  <span>
    👍 {supportCount} supports
  </span>

  <span>
    🛡️ {issue.verifications || 0} verified
  </span>

  <span>
    🕒 {issue.date}
  </span>

</div>

        <div className="issue-card-actions">
          <button
            type="button"
            className="support-button"
            onClick={handleSupport}
            disabled={supporting}
          >
            {supporting ? "Supporting..." : "👍 Support Issue"}
          </button>

          <Link
            to={`/issues/${issue.id}`}
            className="issue-details-btn"
          >
            View Details →
          </Link>
        </div>

        {supportMessage && (
          <div className="support-message">
            {supportMessage}
          </div>
        )}
      </div>
    </article>
  );
}

export default IssueCard;
