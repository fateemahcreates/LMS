import { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

import CourseForm from "../components/CourseForm";
import CourseTable from "../components/CourseTable";
import { notify } from "../utils/notify";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseService";

import "../styles/Courses.css";

function Courses() {
  // ==========================================
  // INITIAL FORM STATE
  // ==========================================
  const initialState = {
    title: "",
    code: "",
    description: "",
    category: "Frontend",
    instructor: "",
    duration: "",
    level: "Beginner",
    thumbnail: "",
    price: 0,
    status: "Draft",
    topics: [],
  };

  const [formData, setFormData] = useState(initialState);

  const [courses, setCourses] = useState([]);

  const [editingCourse, setEditingCourse] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = async () => {
    try {
      const res = await getCourses();

      setCourses(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "price"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  // ==========================================
  // OPEN DRAWER
  // ==========================================

  const handleNewCourse = () => {
    setEditingCourse(null);

    setFormData(initialState);

    setDrawerOpen(true);
  };

  // ==========================================
  // EDIT COURSE
  // ==========================================

  const handleEdit = (course) => {
    setEditingCourse(course);

    setFormData({
      title: course.title || "",
      code: course.code || "",
      description: course.description || "",
      instructor: course.instructor || "",
      duration: course.duration || "",
      category: course.category || "Frontend",
      level: course.level || "Beginner",
      thumbnail: course.thumbnail || "",
      price: course.price || 0,
      status: course.status || "Draft",
      topics: course.topics || [],
    });

    setDrawerOpen(true);
  };

  // ==========================================
  // DELETE COURSE
  // ==========================================

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this course?")) return;

  try {
    await deleteCourse(id);

    notify.success("Course deleted successfully.");

    await fetchCourses();

  } catch (error) {
    console.error(error);

    notify.error(
      error.response?.data?.message ||
      "Unable to delete course."
    );
  }
};

  // ==========================================
  // SAVE COURSE
  // ==========================================

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title || !formData.code) {
    notify.warning(
      "Course title and course code are required."
    );
    return;
  }

  try {
    if (editingCourse) {
      await updateCourse(
        editingCourse._id,
        formData
      );

      notify.success("Course updated successfully.");

    } else {
      await createCourse(formData);

      notify.success("Course created successfully.");
    }

    await fetchCourses();

    setDrawerOpen(false);

    setEditingCourse(null);

    setFormData(initialState);

  } catch (error) {
    console.error(error);

    notify.error(
      error.response?.data?.message ||
      "Unable to save course."
    );
  }
};

  // ==========================================
  // STATS
  // ==========================================

  const published = courses.filter(
    (c) => c.status === "Published"
  ).length;

  const draft = courses.filter(
    (c) => c.status === "Draft"
  ).length;

  const archived = courses.filter(
    (c) => c.status === "Archived"
  ).length;

  return (
    <main className="courses-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>Course Management</h1>

          <p>
            Manage GMT Academy programmes,
            instructors and course information.
          </p>

        </div>

        <button
          className="new-course-btn"
          onClick={handleNewCourse}
        >
          <FaPlus />

          New Course
        </button>

      </div>

      {/* STATS */}

      <div className="course-stats">

        <div className="stat-card">
          <h2>{courses.length}</h2>
          <span>Total Courses</span>
        </div>

        <div className="stat-card">
          <h2>{published}</h2>
          <span>Published</span>
        </div>

        <div className="stat-card">
          <h2>{draft}</h2>
          <span>Draft</span>
        </div>

        <div className="stat-card">
          <h2>{archived}</h2>
          <span>Archived</span>
        </div>

      </div>

      {/* TABLE */}

      <CourseTable
        courses={courses}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* BACKDROP */}

      {drawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() =>
            setDrawerOpen(false)
          }
        />
      )}

      {/* DRAWER */}

      <div
        className={`course-drawer ${
          drawerOpen ? "open" : ""
        }`}
      >

        <div className="drawer-header">

          <div>

            <h2>
              {editingCourse
                ? "Edit Course"
                : "Create Course"}
            </h2>

            <p>
              Configure course information.
            </p>

          </div>

          <button
            className="close-btn"
            onClick={() =>
              setDrawerOpen(false)
            }
          >
            <FaTimes />
          </button>

        </div>

        <CourseForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingCourse={editingCourse}
        />

      </div>

    </main>
  );
}

export default Courses;