import { useEffect, useState } from "react";
import {
  FaBullhorn,
  FaThumbtack,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import "../../styles/StudentAnnouncements.css";
import { getAnnouncements } from "../../services/announcementService";

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="gmt-dashboard-announcements">

      <div className="gmt-dashboard-announcements-header">

        <div>

          <span className="gmt-dashboard-tag">
            ACADEMY UPDATES
          </span>

          <h2>
            Latest Announcements
          </h2>

        </div>

        <Link
          to="/student/announcements"
          className="gmt-dashboard-view-all"
        >
          View All
          <FaArrowRight />
        </Link>

      </div>

      {announcements.length === 0 ? (

        <div className="gmt-dashboard-empty">

          <FaBullhorn className="gmt-dashboard-empty-icon" />

          <h3>No Announcements</h3>

          <p>
            Academy announcements will appear here once published.
          </p>

        </div>

      ) : (

        <div className="gmt-dashboard-announcement-list">

          {announcements.map((announcement) => (

            <article
              key={announcement._id}
              className="gmt-dashboard-announcement-card"
            >

              <div className="gmt-dashboard-announcement-left">

                <div className="gmt-dashboard-icon">

                  {announcement.isPinned ? (
                    <FaThumbtack />
                  ) : (
                    <FaBullhorn />
                  )}

                </div>

              </div>

              <div className="gmt-dashboard-announcement-content">

                <div className="gmt-dashboard-announcement-top">

                  <h4>
                    {announcement.title}
                  </h4>

                  {Date.now() -
                    new Date(
                      announcement.createdAt
                    ).getTime() <
                    1000 * 60 * 60 * 24 && (

                    <span className="gmt-dashboard-new">
                      NEW
                    </span>

                  )}

                </div>

                <p>
                  {announcement.description}
                </p>

                <div className="gmt-dashboard-announcement-bottom">

                  <span
                    className={`gmt-dashboard-type ${announcement.type
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

            </article>

          ))}

        </div>

      )}

    </section>
  );
}

export default StudentAnnouncements;