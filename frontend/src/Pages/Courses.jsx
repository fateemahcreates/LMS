import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaSearch,
  FaBookOpen,
  FaCheckCircle,
  FaEdit,
  FaArchive,
} from "react-icons/fa";

import CourseForm from "../components/CourseForm";
import CourseTable from "../components/CourseTable";

import { notify } from "../utils/notify";

import { getInstructors } from "../services/userService";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseService";

import "../styles/Drawer.css";
import "../styles/Courses.css";

function Courses() {
  /* ==========================================
      INITIAL FORM STATE
  ========================================== */

  const initialState = {
    title: "",
    code: "",
    description: "",
    category: "Frontend",
    instructorUser: "",
    duration: "",
    level: "Beginner",
    thumbnail: "",
    price: 0,
    status: "Draft",
    topics: [],
  };

  /* ==========================================
      STATES
  ========================================== */

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const [formData, setFormData] = useState(initialState);

  const [editingCourse, setEditingCourse] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  /* ==========================================
      FETCH COURSES
  ========================================== */

  const fetchCourses = async () => {
    try {
      const res = await getCourses();

      if (Array.isArray(res.data)) {
        setCourses(res.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.log(error);
      setCourses([]);
    }
  };

  /* ==========================================
      FETCH INSTRUCTORS
  ========================================== */

  const fetchInstructors = async () => {
    try {
      const res = await getInstructors();
      setInstructors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  /* ==========================================
      HANDLE CHANGE
  ========================================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "price"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  /* ==========================================
      NEW COURSE
  ========================================== */

  const handleNewCourse = () => {
    setEditingCourse(null);
    setFormData(initialState);
    setDrawerOpen(true);
  };

  /* ==========================================
      EDIT COURSE
  ========================================== */

  const handleEdit = (course) => {
    setEditingCourse(course);

    setFormData({
      title: course.title || "",
      code: course.code || "",
      description: course.description || "",
      instructorUser:
        course.instructorUser?._id ||
        course.instructorUser ||
        "",
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

  /* ==========================================
      DELETE
  ========================================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await deleteCourse(id);

      notify.success("Course deleted successfully.");

      fetchCourses();
    } catch (error) {
      notify.error(
        error.response?.data?.message ||
          "Unable to delete course."
      );
    }
  };

  /* ==========================================
      SAVE
  ========================================== */

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

        notify.success(
          "Course updated successfully."
        );
      } else {
        await createCourse(formData);

        notify.success(
          "Course created successfully."
        );
      }

      fetchCourses();

      setDrawerOpen(false);

      setEditingCourse(null);

      setFormData(initialState);
    } catch (error) {
      notify.error(
        error.response?.data?.message ||
          "Unable to save course."
      );
    }
  };

  /* ==========================================
      STATISTICS
  ========================================== */

  const published = courses.filter(
    (course) => course.status === "Published"
  ).length;

  const draft = courses.filter(
    (course) => course.status === "Draft"
  ).length;

  const archived = courses.filter(
    (course) => course.status === "Archived"
  ).length;

  /* ==========================================
      SEARCH
  ========================================== */

  const filteredCourses = courses.filter((course) =>
    course.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ==========================================
      UI
  ========================================== */

  return (
    <div className="gmt-admin-courses-page">

      {/* =======================================
          PAGE HEADER
      ======================================= */}

      <div className="gmt-admin-courses-header">

        <div className="gmt-admin-courses-heading">

          <span className="gmt-admin-page-tag">
            GMT SOFTWARE
          </span>

          <h1>Course Management</h1>

          <p>
            Create, organize and manage GMT
            Software learning programmes,
            instructors and course catalogue.
          </p>

        </div>

        <button
          className="gmt-admin-course-btn"
          onClick={handleNewCourse}
        >
          <FaPlus />
          Create Course
        </button>

      </div>

      {/* =======================================
          SEARCH BAR
      ======================================= */}

      <div className="gmt-admin-course-toolbar">

        <div className="gmt-admin-course-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

      </div>

      {/* =======================================
          STATISTICS
      ======================================= */}

      <div className="gmt-admin-course-stats">

        <div className="gmt-admin-course-stat-card">

          <div className="gmt-admin-course-stat-icon">
            <FaBookOpen />
          </div>

          <div>

            <h2>{courses.length}</h2>

            <p>Total Courses</p>

          </div>

        </div>

        <div className="gmt-admin-course-stat-card">

          <div className="gmt-admin-course-stat-icon success">
            <FaCheckCircle />
          </div>

          <div>

            <h2>{published}</h2>

            <p>Published</p>

          </div>

        </div>

        <div className="gmt-admin-course-stat-card">

          <div className="gmt-admin-course-stat-icon warning">
            <FaEdit />
          </div>

          <div>

            <h2>{draft}</h2>

            <p>Draft</p>

          </div>

        </div>

        <div className="gmt-admin-course-stat-card">

          <div className="gmt-admin-course-stat-icon danger">
            <FaArchive />
          </div>

          <div>

            <h2>{archived}</h2>

            <p>Archived</p>

          </div>

        </div>

      </div>

            {/* =======================================
          COURSE TABLE
      ======================================= */}

      <div className="gmt-admin-course-table-wrapper">

        {filteredCourses.length > 0 ? (

          <CourseTable
            courses={filteredCourses}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />

        ) : (

          <div className="gmt-admin-course-empty-state">

            <div className="gmt-admin-course-empty-icon">
              <FaBookOpen />
            </div>

            <h2>No Courses Found</h2>

            <p>
              {searchTerm
                ? "No courses match your search."
                : "You haven't created any courses yet."}
            </p>

            {!searchTerm && (

              <button
                className="gmt-admin-course-btn"
                onClick={handleNewCourse}
              >
                <FaPlus />

                Create Your First Course

              </button>

            )}

          </div>

        )}

      </div>

      {/* =======================================
          DRAWER BACKDROP
      ======================================= */}

      {drawerOpen && (

        <div
          className="drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        />

      )}

      {/* =======================================
          COURSE DRAWER
      ======================================= */}

      <div
        className={`side-drawer ${
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

              {editingCourse
                ? "Update course information and publish changes."
                : "Configure a new course for the GMT Learning Management System."}

            </p>

          </div>

          <button
            className="close-btn"
            onClick={() => setDrawerOpen(false)}
          >

            <FaTimes />

          </button>

        </div>

        <CourseForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingCourse={editingCourse}
          instructors={instructors}
        />

      </div>

    </div>
  );
}

export default Courses;