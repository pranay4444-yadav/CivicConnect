import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IssueCard from "../components/IssueCard";

const sampleIssues = [
  {
    id: 1,
    title: "Large pothole near main road",
    description:
      "A large pothole has developed near the main road and is causing problems for vehicles and pedestrians.",
    category: "Roads",
    location: "Indiranagar",
    status: "Reported",
    supports: 24,
    date: "2 days ago",
    image:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Garbage not collected regularly",
    description:
      "Garbage has not been collected for several days in our neighbourhood. The waste is starting to pile up.",
    category: "Garbage",
    location: "Whitefield",
    status: "In Progress",
    supports: 41,
    date: "4 days ago",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Streetlight not working",
    description:
      "The streetlight near the park has stopped working, making the area difficult to navigate at night.",
    category: "Streetlights",
    location: "Koramangala",
    status: "Verified",
    supports: 18,
    date: "1 week ago",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Water leakage on roadside",
    description:
      "A water pipe appears to be leaking continuously and water is collecting along the roadside.",
    category: "Water",
    location: "HSR Layout",
    status: "Resolved",
    supports: 32,
    date: "1 week ago",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "BBMP garbage truck missed collection",
    description:
      "The garbage collection vehicle has not visited this street for the last three scheduled collections.",
    category: "Garbage",
    location: "Jayanagar",
    status: "Reported",
    supports: 15,
    date: "3 days ago",
    image:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Damaged footpath",
    description:
      "Several sections of the footpath are damaged, making it difficult for pedestrians to walk safely.",
    category: "Roads",
    location: "Malleshwaram",
    status: "In Progress",
    supports: 27,
    date: "5 days ago",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
  },
];

function Issues() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredIssues = sampleIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.description.toLowerCase().includes(search.toLowerCase()) ||
      issue.location.toLowerCase().includes(search.toLowerCase());

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
            <span className="section-badge">Community Issues</span>

            <h1>Issues reported by your community</h1>

            <p>
              Discover civic problems around you, support issues that matter,
              and follow their progress.
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
              <option value="Streetlights">Streetlights</option>
              <option value="Water">Water</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </section>

        <section className="issues-results">
          <div className="results-header">
            <h2>
              {filteredIssues.length}{" "}
              {filteredIssues.length === 1 ? "Issue" : "Issues"}
            </h2>

            <span>Latest reports from the community</span>
          </div>

          {filteredIssues.length > 0 ? (
            <div className="issues-grid">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="no-issues">
              <div className="no-issues-icon">🔍</div>
              <h3>No issues found</h3>
              <p>
                Try changing your search or filters to find other community
                issues.
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