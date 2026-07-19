import {
  FaEdit,
  FaTrash,
  FaThumbtack,
} from "react-icons/fa";

function AnnouncementTable({
  announcements,
  handleEdit,
  handleDelete,
  handleTogglePin,
}) {
  return (
    <div className="announcement-table-card">

      <div className="table-header">
        <h2>Announcements</h2>

        <span className="table-count">
          {announcements.length} Announcement
          {announcements.length !== 1 && "s"}
        </span>
      </div>

      {announcements.length === 0 ? (

        <div className="empty-state">

          <h3>No Announcements Yet</h3>

          <p>
            Create your first announcement to notify students.
          </p>

        </div>

      ) : (

        <div className="table-responsive">

          <table className="announcement-table">

            <thead>

              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Audience</th>
                <th>Course</th>
                <th>Status</th>
                <th>Pinned</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {announcements.map((announcement) => (

                <tr key={announcement._id}>

                  <td>

                    <strong>
                      {announcement.title}
                    </strong>

                    <br />

                    <small>
                      {announcement.description.length > 60
                        ? announcement.description.substring(0, 60) + "..."
                        : announcement.description}
                    </small>

                  </td>

                  <td>

                    <span
                      className={`type-badge ${announcement.type
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {announcement.type}
                    </span>

                  </td>

                  <td>
                    {announcement.audience}
                  </td>

                  <td>
                    {announcement.course?.title || "--"}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${announcement.status.toLowerCase()}`}
                    >
                      {announcement.status}
                    </span>

                  </td>

                  <td>

                    {announcement.isPinned ? (
                      <span className="pinned">
                        📌 Pinned
                      </span>
                    ) : (
                      "--"
                    )}

                  </td>

                  <td>

                    {new Date(
                      announcement.createdAt
                    ).toLocaleDateString()}

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="pin-btn"
                        onClick={() =>
                          handleTogglePin(
                            announcement._id
                          )
                        }
                        title="Pin / Unpin"
                      >
                        <FaThumbtack />
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(announcement)
                        }
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            announcement._id
                          )
                        }
                        title="Delete"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AnnouncementTable;