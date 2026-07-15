import { useState, useEffect } from "react";

import CourseForm from "../components/CourseForm";
import CourseTable from "../components/CourseTable";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseService";

import "../styles/Courses.css";

function Courses() {
  // ==========================================
  // FORM STATE
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
  };

  const [formData, setFormData] = useState(initialState);

  const [courses, setCourses] = useState([]);

  const [editingCourse, setEditingCourse] =
    useState(null);

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
  // HANDLE SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.code) {
      alert("Course title and code are required.");
      return;
    }

    try {
      if (editingCourse) {
        await updateCourse(
          editingCourse._id,
          formData
        );

        setEditingCourse(null);

      } else {
        await createCourse(formData);
      }

      await fetchCourses();

      setFormData(initialState);

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to save course."
      );
    }
  };

  // ==========================================
  // HANDLE DELETE
  // ==========================================
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this course?"
      )
    )
      return;

    try {
      await deleteCourse(id);

      await fetchCourses();

      if (
        editingCourse &&
        editingCourse._id === id
      ) {
        setEditingCourse(null);

        setFormData(initialState);
      }

    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // HANDLE EDIT
  // ==========================================
  const handleEdit = (course) => {
    setEditingCourse(course);

    setFormData({
      title: course.title || "",
      code: course.code || "",
      description:
        course.description || "",
      category:
        course.category || "Frontend",
      instructor:
        course.instructor || "",
      duration:
        course.duration || "",
      level:
        course.level || "Beginner",
      thumbnail:
        course.thumbnail || "",
      price:
        course.price || 0,
      status:
        course.status || "Draft",
    });
  };

  return (
    <main className="dashboard">

      <div className="dashboard-header">
        <h2>Course Management</h2>

        <p>
          Create, organize and manage
          academy courses.
        </p>
      </div>

      <div className="dashboard-content">

        <div className="form-section">

          <CourseForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingCourse={editingCourse}
          />

        </div>

        <div className="table-section">

          <CourseTable
            courses={courses}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />

        </div>

      </div>

    </main>
  );
}

export default Courses;