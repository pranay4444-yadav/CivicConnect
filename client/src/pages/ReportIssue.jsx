import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LocationPicker from "../components/LocationPicker";

function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    neighbourhood: "",
    latitude: null,
    longitude: null,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Check if user is logged in
    if (!token || !user) {
      alert("Please log in before reporting an issue.");
      return;
    }

    // Make sure a location has been selected
    if (!formData.latitude || !formData.longitude) {
      alert("Please select the issue location on the map.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            latitude: formData.latitude,
            longitude: formData.longitude,
            address: formData.location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to report issue."
        );
      }

      console.log("Issue created:", data);

      alert("Issue reported successfully!");

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        location: "",
        neighbourhood: "",
        latitude: null,
        longitude: null,
      });

      setImage(null);

    } catch (error) {
      console.error("Error reporting issue:", error);

      alert(
        error.message || "Something went wrong while reporting the issue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="report-page">
        <section className="report-header">
          <span className="section-badge">Report an Issue</span>

          <h1>Tell us what's happening</h1>

          <p>
            Report a civic problem in your neighbourhood and help your
            community get it resolved.
          </p>
        </section>

        <section className="report-container">
          <form className="report-form" onSubmit={handleSubmit}>

            {/* Issue Details */}
            <div className="form-section">
              <h2>Issue Details</h2>

              <p>Give us some information about the problem.</p>

              <div className="form-group">
                <label htmlFor="title">Issue title</label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. Large pothole near main road"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
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
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

                <span className="form-hint">
                  Include useful details such as when you noticed the issue
                  and how it affects the community.
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="form-section">
              <h2>Location</h2>

              <p>
                Help authorities and nearby residents find the issue.
              </p>

              <div className="form-group">
                <label htmlFor="location">Location / Area</label>

                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g. 12th Main Road, Indiranagar"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="neighbourhood">
                  Neighbourhood
                </label>

                <input
                  type="text"
                  id="neighbourhood"
                  name="neighbourhood"
                  placeholder="e.g. Indiranagar"
                  value={formData.neighbourhood}
                  onChange={handleChange}
                  required
                />
              </div>

              <LocationPicker
                onLocationSelect={(coords) => {
                  setFormData((prev) => ({
                    ...prev,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  }));
                }}
              />
            </div>

            {/* Photo */}
            <div className="form-section">
              <h2>Add a photo</h2>

              <p>
                A photo helps the community and authorities understand the
                issue better.
              </p>

              <label htmlFor="image" className="upload-area">
                <span className="upload-icon">📷</span>

                <strong>
                  {image ? image.name : "Upload an image"}
                </strong>

                <span>
                  {image
                    ? "Click to choose a different image"
                    : "PNG, JPG or JPEG"}
                </span>

                <input
                  type="file"
                  id="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="report-actions">
              <Link
                to="/issues"
                className="btn btn-secondary"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Issue"}
              </button>
            </div>

          </form>

          {/* Information Sidebar */}
          <aside className="report-info">
            <div className="info-card">
              <h3>Before you report</h3>

              <ul>
                <li>
                  Make sure the issue has not already been reported.
                </li>

                <li>
                  Provide an accurate location.
                </li>

                <li>
                  Add a clear photo whenever possible.
                </li>

                <li>
                  Describe how the issue affects residents.
                </li>
              </ul>
            </div>

            <div className="info-card community-tip">
              <span>💡</span>

              <div>
                <h3>Community verification</h3>

                <p>
                  Nearby residents will be able to support and verify
                  genuine issues. This helps CivicConnect highlight
                  problems that affect the community.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ReportIssue;
