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
    <main className="student-page">

      <div className="page-header">
        <h1>Announcements</h1>

        <p>
          Stay informed with the latest updates from
          your academy.
        </p>
      </div>

      {loading ? (

        <p>Loading announcements...</p>

      ) : announcements.length === 0 ? (

        <div className="empty-state">
          <FaBullhorn className="empty-icon" />

          <h3>No Announcements</h3>

          <p>
            Your instructors haven't posted any
            announcements yet.
          </p>
        </div>

      ) : (

        <div className="announcement-list">

          {announcements.map((announcement) => (

            <div
              key={announcement._id}
              className={`announcement-card ${
                announcement.isPinned
                  ? "pinned"
                  : ""
              }`}
            >

              <div className="announcement-header">

                <div>

                  <h2>

                    {announcement.isPinned && (
                      <FaThumbtack className="pin-icon" />
                    )}

                    {announcement.title}

                  </h2>

                  <span
                    className={`announcement-type ${announcement.type
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {announcement.type}
                  </span>

                </div>

                <div className="announcement-date">

                  <FaCalendarAlt />

                  {new Date(
                    announcement.createdAt
                  ).toLocaleDateString()}

                </div>

              </div>

              <p className="announcement-description">
                {announcement.description}
              </p>

              {announcement.course && (

                <div className="announcement-course">

                  <strong>Course:</strong>{" "}
                  {announcement.course.title}

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </main>
  );
}

export default Announcements;