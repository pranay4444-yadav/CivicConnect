import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IssueCard from "../components/IssueCard";

function formatStatus(status) {
  if (!status) return "Reported";

  return status
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date) {
  if (!date) return "";

  const createdDate = new Date(date);
  const now = new Date();

  const differenceInSeconds = Math.floor(
    (now - createdDate) / 1000
  );

  const differenceInMinutes = Math.floor(
    differenceInSeconds / 60
  );

  const differenceInHours = Math.floor(
    differenceInMinutes / 60
  );

  const differenceInDays = Math.floor(
    differenceInHours / 24
  );

  if (differenceInMinutes < 1) {
    return "Just now";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} ${
      differenceInMinutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  if (differenceInHours < 24) {
    return `${differenceInHours} ${
      differenceInHours === 1 ? "hour" : "hours"
    } ago`;
  }

  if (differenceInDays < 7) {
    return `${differenceInDays} ${
      differenceInDays === 1 ? "day" : "days"
    } ago`;
  }

  return createdDate.toLocaleDateString();
}

function Issues() {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/issues"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch issues"
          );
        }

        const formattedIssues = data.issues.map((issue) => ({
  id: issue.id,
  title: issue.title,
  description: issue.description,
  category: issue.category,
  location: issue.address || "Location not provided",
  status: formatStatus(issue.status),

  // Use real database counts
  supports: Number(issue.support_count || 0),
  verifications: Number(issue.verification_count || 0),

  date: formatDate(issue.created_at),

  image:
    issue.image_url ||
    "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80",
}));

        setIssues(formattedIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setError(
          error.message || "Unable to load community issues."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      issue.title.toLowerCase().includes(searchText) ||
      issue.description.toLowerCase().includes(searchText) ||
      issue.location.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || issue.category === category;

    const matchesStatus =
      status === "All" || issue.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      <Navbar />

      <main className="issues-page">
        <section className="issues-header">
          <div>
            <span className="section-badge">
              Community Issues
            </span>

            <h1>Issues reported by your community</h1>

            <p>
              Discover civic problems around you, support issues that
              matter, and follow their progress.
            </p>
          </div>

          <Link to="/report" className="btn btn-primary">
            + Report an Issue
          </Link>
        </section>

        <section className="issues-toolbar">
          <div className="search-box">
            <span>🔎</span>

            <input
              type="text"
              placeholder="Search issues or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Garbage">Garbage</option>
              <option value="Streetlights">
                Streetlights
              </option>
              <option value="Water">Water</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Safety">
                Public Safety
              </option>
              <option value="Other">Other</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
              <option value="Duplicate">Duplicate</option>
            </select>
          </div>
        </section>

        <section className="issues-results">
          <div className="results-header">
            <h2>
              {loading
                ? "Loading..."
                : `${filteredIssues.length} ${
                    filteredIssues.length === 1
                      ? "Issue"
                      : "Issues"
                  }`}
            </h2>

            <span>
              Latest reports from the community
            </span>
          </div>

          {loading ? (
            <div className="no-issues">
              <div className="no-issues-icon">⏳</div>
              <h3>Loading issues...</h3>
              <p>
                We're getting the latest reports from the community.
              </p>
            </div>
          ) : error ? (
            <div className="no-issues">
              <div className="no-issues-icon">⚠️</div>
              <h3>Unable to load issues</h3>
              <p>{error}</p>
            </div>
          ) : filteredIssues.length > 0 ? (
            <div className="issues-grid">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                />
              ))}
            </div>
          ) : (
            <div className="no-issues">
              <div className="no-issues-icon">🔍</div>

              <h3>No issues found</h3>

              <p>
                Try changing your search or filters to find other
                community issues.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Issues;
