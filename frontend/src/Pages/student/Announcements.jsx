import { useEffect, useState } from "react";
import {
  FaBullhorn,
  FaThumbtack,
  FaCalendarAlt,
} from "react-icons/fa";

import { getAnnouncements } from "../../services/announcementService";

import "../../styles/StudentPages.css";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ==========================================
  // FILTER
  // ==========================================

  const filteredAnnouncements = announcements.filter(
    (item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==========================================
  // LOAD ANNOUNCEMENTS
  // ==========================================

  const loadAnnouncements = async () => {
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <main className="gmt-announcement-page">

      {/* ==============================
          HEADER
      ============================== */}

      <div className="gmt-page-header">

        <h1>Announcements</h1>

        <p>
          Stay informed with the latest
          updates from GMT Software Academy.
        </p>

      </div>

      {/* ==============================
          STATISTICS
      ============================== */}

      <div className="gmt-announcement-stats">

  <div className="gmt-stat-card">

    <div className="gmt-stat-content">
      <h2>{announcements.length}</h2>
      <p>Total Updates</p>
    </div>

  </div>

  <div className="gmt-stat-card">

    <div className="gmt-stat-content">
      <h2>
        {announcements.filter(item => item.isPinned).length}
      </h2>
      <p>Pinned</p>
    </div>

  </div>

  <div className="gmt-stat-card">

    <div className="gmt-stat-content">
      <h2>
        {
          announcements.filter(
            item =>
              Date.now() -
                new Date(item.createdAt).getTime() <
              1000 * 60 * 60 * 24
          ).length
        }
      </h2>
      <p>New Today</p>
    </div>

  </div>

</div>
      {/* ==============================
          SEARCH
      ============================== */}

      <div className="gmt-search-box">

        <input
          type="text"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* ==============================
          LOADING
      ============================== */}

      {loading ? (

        <div className="gmt-loading">

          <p>Loading announcements...</p>

        </div>

      ) : filteredAnnouncements.length === 0 ? (

        <div className="gmt-empty-state">

          <FaBullhorn className="gmt-empty-icon" />

          <h3>No Announcements</h3>

          <p>
            Your instructors haven't posted
            any announcements yet.
          </p>

        </div>

      ) : (

        <div className="gmt-announcement-list">

          {filteredAnnouncements.map(
            (announcement) => (

              <div
                key={announcement._id}
                className={`gmt-announcement-card ${
                  announcement.isPinned
                    ? "pinned"
                    : ""
                }`}
              >

                {/* Header */}

                <div className="gmt-card-header">

                  <div>

                    <h2>

                      {announcement.isPinned && (

                        <FaThumbtack className="gmt-pin-icon" />

                      )}

                      {announcement.title}

                    </h2>

                    <span
                      className={`gmt-announcement-type ${announcement.type
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {announcement.type}
                    </span>

                  </div>

                  <div className="gmt-card-date">

                    {new Date(
                      announcement.createdAt
                    ).toLocaleDateString()}

                  </div>

                </div>

                {/* Description */}

                <p className="gmt-card-description">

                  {announcement.description}

                </p>

                {/* Course */}

                {announcement.course && (

                  <div className="gmt-course-tag">

                    <strong>Course:</strong>{" "}

                    {announcement.course.title}

                  </div>

                )}

              </div>

            )
          )}

        </div>

      )}

    </main>
  );
}

export default Announcements;