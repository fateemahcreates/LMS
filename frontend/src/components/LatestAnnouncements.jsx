import { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";

import { getAnnouncements } from "../services/announcementService";
import { Link } from "react-router-dom";

import "../styles/LatestAnnouncements.css";

function LatestAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();

      // Show only the latest 3
      setAnnouncements(res.data.slice(0, 3));

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="latest-announcements">

      <div className="latest-header">

  <h2>
    <FaBullhorn />
    Latest Announcements
  </h2>

  <Link
    to="/announcements"
    className="view-all-btn"
  >
    View All
  </Link>

</div>

      {announcements.length === 0 ? (
        <p className="empty-announcements">
          No announcements available.
        </p>
      ) : (
        announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="announcement-card"
          >
            <span
              className={`announcement-badge ${announcement.type
                .toLowerCase()
                .replace(/\s/g, "-")}`}
            >
              {announcement.type}
            </span>

            <div className="announcement-title">

  <h3>{announcement.title}</h3>

  {Date.now() -
    new Date(
      announcement.createdAt
    ).getTime() <
    1000 * 60 * 60 * 24 && (
      <span className="new-badge">
        NEW
      </span>
  )}

</div>
            <p>{announcement.description}</p>

            <small>
              {new Date(
                announcement.createdAt
              ).toLocaleDateString()}
            </small>
          </div>
        ))
      )}

    </section>
  );
}

export default LatestAnnouncements;