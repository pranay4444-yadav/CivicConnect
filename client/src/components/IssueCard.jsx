import { Link } from "react-router-dom";

function IssueCard({ issue }) {
  return (
    <article className="issue-card">
      <div className="issue-image">
        <img src={issue.image} alt={issue.title} />
        <span className={`issue-status ${issue.status.toLowerCase().replace(" ", "-")}`}>
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
          <span>👍 {issue.supports} supports</span>
          <span>🕒 {issue.date}</span>
        </div>

        <Link to={`/issues/${issue.id}`} className="issue-details-btn">
          View Details →
        </Link>
      </div>
    </article>
  );
}

export default IssueCard;