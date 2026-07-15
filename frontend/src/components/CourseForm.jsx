import "../styles/CourseForm.css";

import {
  FaBookOpen,
  FaHashtag,
  FaChalkboardTeacher,
  FaClock,
  FaLayerGroup,
  FaToggleOn,
  FaPlus,
  FaEdit,
  FaSignal,
  FaImage,
  FaDollarSign,
  FaAlignLeft,
} from "react-icons/fa";

function CourseForm({
  formData,
  handleChange,
  handleSubmit,
  editingCourse,
}) {
  return (
    <form className="course-form" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="form-header">
        <h2>
          {editingCourse ? "Edit Course" : "Create Course"}
        </h2>

        <p>
          Build a new learning experience for your students.
        </p>
      </div>

      {/* Title */}
      <div className="input-group">
        <label>Course Title</label>

        <div className="input-wrapper">
          <FaBookOpen className="input-icon" />

          <input
            type="text"
            name="title"
            placeholder="React Masterclass"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Code */}
      <div className="input-group">
        <label>Course Code</label>

        <div className="input-wrapper">
          <FaHashtag className="input-icon" />

          <input
            type="text"
            name="code"
            placeholder="REACT101"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="input-group">
        <label>Description</label>

        <div className="input-wrapper textarea-wrapper">
          <FaAlignLeft className="input-icon" />

          <textarea
            name="description"
            placeholder="Describe this course..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
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

      {/* Duration */}
      <div className="input-group">
        <label>Duration</label>

        <div className="input-wrapper">
          <FaClock className="input-icon" />

          <input
            type="text"
            name="duration"
            placeholder="8 Weeks"
            value={formData.duration}
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
            <option value="">Select Category</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Mobile">Mobile</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Data Science">Data Science</option>
            <option value="AI">AI</option>
            <option value="DevOps">DevOps</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Cloud">Cloud</option>
          </select>
        </div>
      </div>

      {/* Level */}
      <div className="input-group">
        <label>Difficulty</label>

        <div className="input-wrapper">
          <FaSignal className="input-icon" />

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="input-group">
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

      {/* Price */}
      <div className="input-group">
        <label>Price ($)</label>

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

      <button
        type="submit"
        className="submit-btn"
      >
        {editingCourse ? <FaEdit /> : <FaPlus />}

        <span>
          {editingCourse
            ? "Update Course"
            : "Create Course"}
        </span>
      </button>
    </form>
  );
}

export default CourseForm;