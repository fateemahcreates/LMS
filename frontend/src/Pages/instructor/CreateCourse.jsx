import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBookOpen,
  FaCloudUploadAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { createCourse } from "../../services/courseService";
import "../../styles/CreateCourse.css";

function CreateCourse() {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: "",
    code: "",
    category: "",
    level: "",
    duration: "",
    description: "",
    thumbnail: "",
    price: "",
    status: "Draft",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createCourse(courseData);

      alert("Course created successfully!");

      navigate("/instructor/courses");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create course."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-course-page">
      {/* ==========================
          PAGE HEADER
      ========================== */}

      <section className="create-course-header">
        <div>
          <h1>Create New Course</h1>

          <p>
            Create and publish a new learning
            programme for GMT Software Academy.
          </p>
        </div>
      </section>

      {/* ==========================
          FORM
      ========================== */}

      <form
        className="create-course-form"
        onSubmit={handleSubmit}
      >
        {/* ==========================
            COURSE INFORMATION
        ========================== */}

        <div className="create-course-card">
          <h2>
            <FaBookOpen />
            Course Information
          </h2>

          <div className="create-course-grid">
            <div className="create-course-input">
              <label>Course Title</label>

              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                placeholder="Introduction to React"
                required
              />
            </div>

            <div className="create-course-input">
              <label>Course Code</label>

              <input
                type="text"
                name="code"
                value={courseData.code}
                onChange={handleChange}
                placeholder="REACT101"
                required
              />
            </div>

            <div className="create-course-input">
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={courseData.category}
                onChange={handleChange}
                placeholder="Frontend Development"
              />
            </div>

            <div className="create-course-input">
              <label>Level</label>

              <select
                name="level"
                value={courseData.level}
                onChange={handleChange}
              >
                <option value="">
                  Select Level
                </option>

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

            <div className="create-course-input">
              <label>Duration</label>

              <input
                type="text"
                name="duration"
                value={courseData.duration}
                onChange={handleChange}
                placeholder="12 Weeks"
              />
            </div>

            <div className="create-course-input">
              <label>Status</label>

              <select
                name="status"
                value={courseData.status}
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

        {/* ==========================
            DESCRIPTION
        ========================== */}

        <div className="create-course-card">
          <h2>Description</h2>

          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            placeholder="Write a detailed course description..."
            rows="8"
          />
        </div>

        {/* ==========================
            THUMBNAIL
        ========================== */}

        <div className="create-course-card">
          <h2>
            <FaCloudUploadAlt />
            Course Thumbnail
          </h2>

          <input
            type="text"
            name="thumbnail"
            value={courseData.thumbnail}
            onChange={handleChange}
            placeholder="Paste image URL"
          />
        </div>

        {/* ==========================
            PRICE
        ========================== */}

        <div className="create-course-card">
          <h2>Pricing</h2>

          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            placeholder="Course Price (₦)"
          />
        </div>

        {/* ==========================
            ACTION BUTTONS
        ========================== */}

        <div className="create-course-actions">
          <button
            type="button"
            className="create-course-cancel"
            onClick={() =>
              navigate("/instructor/courses")
            }
          >
            <FaTimes />
            Cancel
          </button>

          <button
            type="submit"
            className="create-course-submit"
            disabled={loading}
          >
            <FaSave />

            {loading
              ? "Creating..."
              : "Create Course"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateCourse;