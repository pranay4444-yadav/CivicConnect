import { useEffect, useState } from "react";

function Community() {
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [messages, setMessages] = useState({});

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const neighbourhoodResponse = await fetch(
          "http://localhost:5000/api/neighbourhoods"
        );

        const neighbourhoodData =
          await neighbourhoodResponse.json();

        if (!neighbourhoodResponse.ok) {
          throw new Error(
            neighbourhoodData.message ||
              "Failed to load neighbourhoods"
          );
        }

        let memberships = [];

        const token = localStorage.getItem("token");

        if (token) {
          const membershipResponse = await fetch(
            "http://localhost:5000/api/neighbourhoods/my-memberships",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const membershipData =
            await membershipResponse.json();

          if (membershipResponse.ok) {
            memberships = membershipData.memberships || [];
          }
        }

        const joinedIds = new Set(
          memberships.map(
            (membership) => membership.neighbourhood_id
          )
        );

        const updatedNeighbourhoods =
          (neighbourhoodData.neighbourhoods || []).map(
            (neighbourhood) => ({
              ...neighbourhood,
              joined: joinedIds.has(neighbourhood.id),
            })
          );

        setNeighbourhoods(updatedNeighbourhoods);
      } catch (error) {
        console.error("Community fetch error:", error);

        setMessages({
          page: "Unable to load community information.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  const handleJoin = async (neighbourhoodId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessages({
        [neighbourhoodId]:
          "Please log in to join a neighbourhood.",
      });
      return;
    }

    try {
      setJoiningId(neighbourhoodId);

      const response = await fetch(
        `http://localhost:5000/api/neighbourhoods/${neighbourhoodId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessages((previous) => ({
          ...previous,
          [neighbourhoodId]:
            data.message ||
            "Unable to join neighbourhood.",
        }));
        return;
      }

      setNeighbourhoods((previous) =>
        previous.map((neighbourhood) =>
          neighbourhood.id === neighbourhoodId
            ? {
                ...neighbourhood,
                joined: true,
              }
            : neighbourhood
        )
      );

      setMessages((previous) => ({
        ...previous,
        [neighbourhoodId]: "Joined successfully ✓",
      }));
    } catch (error) {
      console.error("Join neighbourhood error:", error);

      setMessages((previous) => ({
        ...previous,
        [neighbourhoodId]:
          "Unable to join neighbourhood. Please try again.",
      }));
    } finally {
      setJoiningId(null);
    }
  };

  const handleCreateNeighbourhood = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessages({
        page: "Please log in to create a neighbourhood.",
      });
      return;
    }

    if (!createForm.name.trim()) {
      setMessages({
        page: "Neighbourhood name is required.",
      });
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(
        "http://localhost:5000/api/neighbourhoods",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: createForm.name.trim(),
            description: createForm.description.trim(),
            latitude: createForm.latitude
              ? Number(createForm.latitude)
              : null,
            longitude: createForm.longitude
              ? Number(createForm.longitude)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessages({
          page:
            data.message ||
            "Unable to create neighbourhood.",
        });
        return;
      }

      setNeighbourhoods((previous) => [
        {
          ...data.neighbourhood,
          joined: true,
        },
        ...previous,
      ]);

      setCreateForm({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
      });

      setShowCreateForm(false);

      setMessages({
        page: "Neighbourhood created successfully ✓",
      });
    } catch (error) {
      console.error(
        "Create neighbourhood error:",
        error
      );

      setMessages({
        page:
          "Unable to create neighbourhood. Please try again.",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="community-page">

      {/* HEADER */}
      <section className="community-header">
        <div>
          <span className="section-eyebrow">
            Community
          </span>

          <h1>Neighbourhoods</h1>

          <p>
            Connect with people in your area, discuss local
            issues, and work together to improve your
            community.
          </p>
        </div>
      </section>

      {/* BODY */}
      <section className="community-page-content">

        {/* COMMUNITY OVERVIEW */}
        <div className="community-overview">

          <div className="community-overview-text">
            <span className="section-eyebrow">
              CivicConnect Communities
            </span>

            <h2>Find your neighbourhood</h2>

            <p>
              Join a local community, support civic issues,
              and work together with people living nearby.
            </p>
          </div>

          <div className="community-overview-action">
            <div className="community-count">
              <strong>{neighbourhoods.length}</strong>
              <span>
                {neighbourhoods.length === 1
                  ? "Community"
                  : "Communities"}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setShowCreateForm(!showCreateForm)
              }
            >
              {showCreateForm
                ? "Cancel"
                : "+ Create Neighbourhood"}
            </button>
          </div>

        </div>

        {/* MESSAGE */}
        {messages.page && (
          <div className="community-message">
            {messages.page}
          </div>
        )}

        {/* CREATE FORM */}
        {showCreateForm && (
          <form
            className="community-create-form"
            onSubmit={handleCreateNeighbourhood}
          >
            <div className="community-create-form-header">
              <span className="section-eyebrow">
                New Community
              </span>

              <h3>Create a Neighbourhood</h3>

              <p>
                Start a local community and become its
                neighbourhood head.
              </p>
            </div>

            <div className="community-form-grid">

              <div className="form-group">
                <label htmlFor="neighbourhood-name">
                  Neighbourhood Name
                </label>

                <input
                  id="neighbourhood-name"
                  type="text"
                  value={createForm.name}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Green Park Residents"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="neighbourhood-description">
                  Description
                </label>

                <input
                  id="neighbourhood-description"
                  type="text"
                  value={createForm.description}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe your neighbourhood"
                />
              </div>

              <div className="form-group">
                <label htmlFor="neighbourhood-latitude">
                  Latitude
                </label>

                <input
                  id="neighbourhood-latitude"
                  type="number"
                  step="any"
                  value={createForm.latitude}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      latitude: event.target.value,
                    })
                  }
                  placeholder="12.9716"
                />
              </div>

              <div className="form-group">
                <label htmlFor="neighbourhood-longitude">
                  Longitude
                </label>

                <input
                  id="neighbourhood-longitude"
                  type="number"
                  step="any"
                  value={createForm.longitude}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      longitude: event.target.value,
                    })
                  }
                  placeholder="77.5946"
                />
              </div>

            </div>

            <div className="community-create-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Neighbourhood"}
              </button>
            </div>
          </form>
        )}

        {/* COMMUNITY LIST */}
        <div className="community-list-header">
          <div>
            <h2>Explore Communities</h2>

            <p>
              Find and join a neighbourhood near you.
            </p>
          </div>
        </div>

        {loading && (
          <div className="community-empty">
            <h3>Loading communities...</h3>
          </div>
        )}

        {!loading &&
          !messages.page &&
          neighbourhoods.length === 0 && (
            <div className="community-empty">
              <div className="community-empty-icon">
                🏘️
              </div>

              <h3>No communities yet</h3>

              <p>
                Be the first to create a neighbourhood
                community in your area.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setShowCreateForm(true)
                }
              >
                Create First Community
              </button>
            </div>
          )}

        {!loading &&
          neighbourhoods.length > 0 && (
            <div className="community-grid">
              {neighbourhoods.map((neighbourhood) => (
                <article
                  className="community-card"
                  key={neighbourhood.id}
                >
                  <div className="community-card-top">
                    <div className="community-card-icon">
                      🏘️
                    </div>

                    {neighbourhood.joined && (
                      <span className="community-joined">
                        ✓ Joined
                      </span>
                    )}
                  </div>

                  <div className="community-card-content">

                    <h3>{neighbourhood.name}</h3>

                    <p>
                      {neighbourhood.description ||
                        "A CivicConnect neighbourhood community."}
                    </p>

                    <div className="community-card-details">

                      <div>
                        <span>📍</span>

                        <span>
                          {neighbourhood.latitude &&
                          neighbourhood.longitude
                            ? `${Number(
                                neighbourhood.latitude
                              ).toFixed(4)}, ${Number(
                                neighbourhood.longitude
                              ).toFixed(4)}`
                            : "Location not specified"}
                        </span>
                      </div>

                      <div>
                        <span>👥</span>

                        <span>
                          CivicConnect Community
                        </span>
                      </div>

                    </div>

                    <button
                      type="button"
                      className={
                        neighbourhood.joined
                          ? "btn community-joined-button"
                          : "btn btn-primary"
                      }
                      onClick={() =>
                        handleJoin(neighbourhood.id)
                      }
                      disabled={
                        joiningId === neighbourhood.id ||
                        neighbourhood.joined
                      }
                    >
                      {joiningId === neighbourhood.id
                        ? "Joining..."
                        : neighbourhood.joined
                        ? "Already Joined"
                        : "Join Neighbourhood"}
                    </button>

                    {messages[neighbourhood.id] && (
                      <div className="community-card-message">
                        {messages[neighbourhood.id]}
                      </div>
                    )}

                  </div>
                </article>
              ))}
            </div>
          )}

      </section>
    </main>
  );
}

export default Community;

