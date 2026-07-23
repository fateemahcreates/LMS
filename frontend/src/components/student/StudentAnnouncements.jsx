import { useEffect, useState } from "react";

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

      setAnnouncements(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="student-announcements">

      <div className="announcement-header">

        <h2>Latest Announcements</h2>

        <span>Recent Updates</span>

      </div>

      {announcements.map((announcement) => (

        <div
          className="announcement-item"
          key={announcement._id}
        >

          <div className="announcement-left">

            <span className={`announcement-type ${announcement.type.toLowerCase()}`}>
              {announcement.type}
            </span>

            <h3>{announcement.title}</h3>

<p>
  {announcement.description}
</p>

          </div>

          <small>
  {new Date(
    announcement.createdAt
  ).toLocaleDateString()}
</small>

        </div>

      ))}

    </div>
  );
}

export default StudentAnnouncements;