import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";

function AnnouncementForm({
  formData,
  handleChange,
  handleSubmit,
  editingAnnouncement,
}) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="announcement-form-card">

      <h2>
        {editingAnnouncement
          ? "Update Announcement"
          : "Create Announcement"}
      </h2>

      <form onSubmit={handleSubmit}>

        {/* Title */}

        <div className="form-group">

          <label>Announcement Title *</label>

          <input
            type="text"
            name="title"
            placeholder="Enter announcement title"
            value={formData.title}
            onChange={handleChange}
            required
          />

        </div>

        {/* Type */}

        <div className="form-row">

          <div className="form-group">

            <label>Type</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="General">
                General
              </option>

              <option value="Assignment">
                Assignment
              </option>

              <option value="Exam">
                Exam
              </option>

              <option value="Holiday">
                Holiday
              </option>

              <option value="Course Update">
                Course Update
              </option>

            </select>

          </div>

          <div className="form-group">

            <label>Audience</label>

            <select
              name="audience"
              value={formData.audience}
              onChange={handleChange}
            >
              <option value="Everyone">
                Everyone
              </option>

              <option value="Course">
                Specific Course
              </option>

            </select>

          </div>

        </div>

        {/* Course */}

        {formData.audience === "Course" && (

          <div className="form-group">

            <label>Select Course</label>

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">
                Choose Course
              </option>

              {courses.map((course) => (

                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.title}
                </option>

              ))}

            </select>

          </div>

        )}

        {/* Description */}

        <div className="form-group">

          <label>Description *</label>

          <textarea
            rows="6"
            name="description"
            placeholder="Write announcement..."
            value={formData.description}
            onChange={handleChange}
            required
          />

        </div>

        {/* Expiry Date */}

        <div className="form-group">

          <label>Expiry Date</label>

          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
          />

        </div>

        {/* Pin */}

        <div className="checkbox-group">

          <label>

            <input
              type="checkbox"
              name="isPinned"
              checked={formData.isPinned}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "isPinned",
                    value: e.target.checked,
                  },
                })
              }
            />

            Pin this announcement

          </label>

        </div>

        {/* Status */}

        <div className="form-group">

          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">
              Active
            </option>

            <option value="Archived">
              Archived
            </option>

          </select>

        </div>

        <button
          className="submit-btn"
          type="submit"
        >
          {editingAnnouncement
            ? "Update Announcement"
            : "Publish Announcement"}
        </button>

      </form>

    </div>
  );
}

export default AnnouncementForm;