import "../styles/CourseForm.css";

import {
  FaBookOpen,
  FaHashtag,
  FaAlignLeft,
  FaLayerGroup,
  FaSignal,
  FaClock,
  FaImage,
  FaDollarSign,
  FaCheckCircle,
  FaSave,
  FaChalkboardTeacher,
} from "react-icons/fa";

function CourseForm({
  formData,
  handleChange,
  handleSubmit,
  editingCourse,
  instructors = [],
}) {
  return (
    <form
      className="gmt-course-form"
      onSubmit={handleSubmit}
    >

      {/* =====================================
          PROGRAMME INFORMATION
      ===================================== */}

      <div className="gmt-course-section">

        <h3 className="gmt-course-section-title">
          Programme Information
        </h3>

        <div className="gmt-course-grid">

          {/* Programme Title */}

          <div className="gmt-input-group full-width">

            <label>
              Programme Title
            </label>

            <div className="gmt-input-wrapper">

              <FaBookOpen className="gmt-input-icon" />

              <input
                type="text"
                name="title"
                placeholder="Full Stack Web Development"
                value={formData.title}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Programme Code */}

          <div className="gmt-input-group">

            <label>
              Programme Code
            </label>

            <div className="gmt-input-wrapper">

              <FaHashtag className="gmt-input-icon" />

              <input
                type="text"
                name="code"
                placeholder="GMT-FSW-001"
                value={formData.code}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Description */}

          <div className="gmt-input-group full-width">

            <label>
              Programme Description
            </label>

            <div className="gmt-input-wrapper textarea">

              <FaAlignLeft className="gmt-input-icon" />

              <textarea
                rows="5"
                name="description"
                placeholder="Provide a detailed overview of this programme, expected learning outcomes and target audience..."
                value={formData.description}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          INSTRUCTOR ASSIGNMENT
      ===================================== */}

      <div className="gmt-course-section">

        <h3 className="gmt-course-section-title">
          Instructor Assignment
        </h3>

        <div className="gmt-course-grid">

          {/* Instructor */}

          <div className="gmt-input-group">

            <label>
              Assigned Instructor
            </label>

            <div className="gmt-input-wrapper">

              <FaChalkboardTeacher className="gmt-input-icon" />

              <select
                name="instructorUser"
                value={formData.instructorUser || ""}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Instructor
                </option>

                {Array.isArray(instructors) &&
                  instructors.map((person) => (
                    <option
                      key={person._id}
                      value={person._id}
                    >
                      {person.name}
                    </option>
                  ))}

              </select>

            </div>

          </div>

          {/* Category */}

          <div className="gmt-input-group">

            <label>
              Category
            </label>

            <div className="gmt-input-wrapper">

              <FaLayerGroup className="gmt-input-icon" />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >

                <option value="Frontend">
                  Frontend
                </option>

                <option value="Backend">
                  Backend
                </option>

                <option value="Full Stack">
                  Full Stack
                </option>

                <option value="Mobile">
                  Mobile
                </option>

                <option value="UI/UX">
                  UI / UX
                </option>

                <option value="Data Science">
                  Data Science
                </option>

                <option value="AI">
                  Artificial Intelligence
                </option>

                <option value="DevOps">
                  DevOps
                </option>

                <option value="Cybersecurity">
                  Cybersecurity
                </option>

                <option value="Cloud">
                  Cloud Computing
                </option>

              </select>

            </div>

          </div>

          {/* Learning Level */}

          <div className="gmt-input-group">

            <label>
              Learning Level
            </label>

            <div className="gmt-input-wrapper">

              <FaSignal className="gmt-input-icon" />

              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
              >

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          PROGRAMME SETTINGS
      ===================================== */}

      <div className="gmt-course-section">

        <h3 className="gmt-course-section-title">
          Programme Settings
        </h3>

        <div className="gmt-course-grid">

          {/* Duration */}

          <div className="gmt-input-group">

            <label>
              Duration
            </label>

            <div className="gmt-input-wrapper">

              <FaClock className="gmt-input-icon" />

              <input
                type="text"
                name="duration"
                placeholder="12 Weeks"
                value={formData.duration}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* Fee */}

          <div className="gmt-input-group">

            <label>
              Programme Fee ($)
            </label>

            <div className="gmt-input-wrapper">

              <FaDollarSign className="gmt-input-icon" />

              <input
                type="number"
                name="price"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* Status */}

          <div className="gmt-input-group">

            <label>
              Status
            </label>

            <div className="gmt-input-wrapper">

              <FaCheckCircle className="gmt-input-icon" />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Draft">
                  Draft
                </option>

                <option value="Published">
                  Published
                </option>

                <option value="Archived">
                  Archived
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          MEDIA
      ===================================== */}

      <div className="gmt-course-section">

        <h3 className="gmt-course-section-title">
          Media
        </h3>

        <div className="gmt-course-grid">

          <div className="gmt-input-group full-width">

            <label>
              Cover Image URL
            </label>

            <div className="gmt-input-wrapper">

              <FaImage className="gmt-input-icon" />

              <input
                type="text"
                name="thumbnail"
                placeholder="https://example.com/course-cover.jpg"
                value={formData.thumbnail}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          BUTTON
      ===================================== */}

      <button
        type="submit"
        className="gmt-course-submit"
      >

        <FaSave />

        <span>

          {editingCourse
            ? "Update Programme"
            : "Create Programme"}

        </span>

      </button>

    </form>
  );
}

export default CourseForm;