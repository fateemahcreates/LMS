import {
  FaClipboardCheck,
  FaCertificate,
  FaBullhorn,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/LatestActivity.css";
import { useEffect, useState } from "react";

import { getLatestActivity } from "../services/activityService";
const getActivityIcon = (type) => {
  switch (type) {
    case "submission":
      return <FaClipboardCheck />;

    case "graded":
      return <FaCheckCircle />;

    case "announcement":
      return <FaBullhorn />;

    case "certificate":
      return <FaCertificate />;

    default:
      return <FaFileAlt />;
  }
};
function LatestActivity() {
  const [activities, setActivities] = useState([]);

useEffect(() => {
  fetchActivity();
}, []);

const fetchActivity = async () => {
  try {
    const res = await getLatestActivity();
    setActivities(res.data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="activity-card">

      {/* Header */}

      <div className="activity-header">

        <div>

          <span className="activity-tag">
  ACADEMIC ACTIVITY
</span>

<h2>Recent Academic Activity</h2>
        </div>

      </div>

      {/* Activity List */}

      <div className="activity-list">

        {activities.map((activity) => (

          <div
            className="activity-item"
            key={index}
          >

            {/* Icon */}

           <div className="activity-icon">
  {getActivityIcon(activity.type)}
</div>
            {/* Content */}

            <div className="activity-content">

              <h4>{activity.title}</h4>

              <p>{activity.description}</p>

            </div>

            {/* Time */}

            <span className="activity-time">
             {new Date(activity.createdAt).toLocaleString()}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default LatestActivity;