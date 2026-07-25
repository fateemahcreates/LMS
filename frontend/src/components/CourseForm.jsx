import "../styles/CourseForm.css";


import {
  FaBookOpen,
  FaHashtag,
  FaAlignLeft,
  FaLayerGroup,
  FaSignal,
  FaClock,
  FaChalkboardTeacher,
  FaImage,
  FaDollarSign,
  FaToggleOn,
  FaSave,
} from "react-icons/fa";

function CourseForm({
  formData,
  handleChange,
  handleSubmit,
  editingCourse,
}) {
  return (
    <form
      className="course-form"
      onSubmit={handleSubmit}
    >
      <div className="form-grid">

        {/* Course Title */}
        <div className="input-group full-width">
          <label>Course Title</label>

          <div className="input-wrapper">
            <FaBookOpen className="input-icon" />

            <input
              type="text"
              name="title"
              placeholder="Frontend Development"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Course Code */}
        <div className="input-group">
          <label>Course Code</label>

          <div className="input-wrapper">
            <FaHashtag className="input-icon" />

            <input
              type="text"
              name="code"
              placeholder="GMT-FE-001"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Instructor */}
        <div className="input-group">
          <label>Instructor</label>

          <div className="input-wrapper">
            <FaChalkboardTeacher className="input-icon" />

            <input
              type="text"
              name="instructor"
              placeholder="John Doe"
              value={formData.instructor}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Category */}
        <div className="input-group">
          <label>Category</label>

          <div className="input-wrapper">
            <FaLayerGroup className="input-icon" />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Mobile">Mobile</option>
              <option value="UI/UX">UI / UX</option>
              <option value="Data Science">Data Science</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="DevOps">DevOps</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Cloud">Cloud Computing</option>
            </select>
          </div>
        </div>

        {/* Difficulty */}
        <div className="input-group">
          <label>Difficulty</label>

          <div className="input-wrapper">
            <FaSignal className="input-icon" />

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        {/* Duration */}
        <div className="input-group">
          <label>Duration</label>

          <div className="input-wrapper">
            <FaClock className="input-icon" />

            <input
              type="text"
              name="duration"
              placeholder="12 Weeks"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Price */}
        <div className="input-group">
          <label>Fee ($)</label>

          <div className="input-wrapper">
            <FaDollarSign className="input-icon" />

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Status */}
        <div className="input-group">
          <label>Status</label>

          <div className="input-wrapper">
            <FaToggleOn className="input-icon" />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="input-group full-width">
          <label>Thumbnail URL</label>

          <div className="input-wrapper">
            <FaImage className="input-icon" />

            <input
              type="text"
              name="thumbnail"
              placeholder="https://..."
              value={formData.thumbnail}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Description */}
        <div className="input-group full-width">
          <label>Description</label>

          <div className="input-wrapper textarea-wrapper">
            <FaAlignLeft className="input-icon" />

            <textarea
              rows="6"
              name="description"
              placeholder="Describe this course..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

      </div>

      <button
        type="submit"
        className="submit-btn"
      >
        <FaSave />

        {editingCourse
          ? "Update Course"
          : "Create Course"}
      </button>
    </form>
  );
}

export default CourseForm;