import { useEffect, useState } from "react";
import {
  FaBullhorn,
  FaArrowRight,
  FaThumbtack,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { getAnnouncements } from "../../services/announcementService";

import "../../styles/StudentAnnouncements.css";

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();

      setAnnouncements(res.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="gmt-announcements">

      {/* Header */}

      <div className="gmt-announcements-header">

        <div>

          <span className="gmt-announcements-tag">
            GMT SOFTWARE ACADEMY
          </span>

          <h2>Latest Announcements</h2>

        </div>

        <Link
          to="/student/announcements"
          className="gmt-announcements-link"
        >
          View All
          <FaArrowRight />
        </Link>

      </div>

      {announcements.length === 0 ? (

        <div className="gmt-announcements-empty">

          <FaBullhorn className="gmt-empty-icon" />

          <h3>No Announcements Yet</h3>

          <p>
            Academy announcements will appear here
            once they are published.
          </p>

        </div>

      ) : (

        <div className="gmt-announcements-list">

          {announcements.map((announcement) => (

            <div
              key={announcement._id}
              className="gmt-announcement-card"
            >

              {/* Icon */}

              <div className="gmt-announcement-icon">

                {announcement.isPinned ? (
                  <FaThumbtack />
                ) : (
                  <FaBullhorn />
                )}

              </div>

              {/* Body */}

              <div className="gmt-announcement-content">

                <div className="gmt-announcement-top">

                  <h4>
                    {announcement.title}
                  </h4>

                  {Date.now() -
                    new Date(
                      announcement.createdAt
                    ).getTime() <
                    1000 * 60 * 60 * 24 && (

                    <span className="gmt-new-badge">
                      NEW
                    </span>

                  )}

                </div>

                <p>
                  {announcement.description}
                </p>

                <div className="gmt-announcement-footer">

                  <span
                    className={`gmt-announcement-type ${announcement.type
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {announcement.type}
                  </span>

                  <small>
                    {new Date(
                      announcement.createdAt
                    ).toLocaleDateString()}
                  </small>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

export default StudentAnnouncements;