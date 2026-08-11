import { useEffect, useState } from "react";

import {
  FaBullhorn,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCalendarAlt,
  FaBookOpen,
  FaExclamationCircle,
} from "react-icons/fa";

import {
  getInstructorAnnouncements,
  createInstructorAnnouncement,
  updateInstructorAnnouncement,
  deleteInstructorAnnouncement,
} from "../../services/instructorAnnouncementService";

import {
  getInstructorCourses,
} from "../../services/instructorService";

import "../../styles/InstructorAnnouncements.css";


function InstructorAnnouncements() {

  // ==========================================
  // STATE
  // ==========================================

  const [announcements, setAnnouncements] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingAnnouncement, setEditingAnnouncement] =
    useState(null);

  const [error, setError] =
    useState("");


  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "General",
    audience: "Course",
    course: "",
    status: "Active",
  });


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {

    try {

      setLoading(true);

      setError("");

      const [
        announcementsResponse,
        coursesResponse,
      ] = await Promise.all([
        getInstructorAnnouncements(),
        getInstructorCourses(),
      ]);


      setAnnouncements(
        announcementsResponse.data || []
      );


      setCourses(
        coursesResponse.data || []
      );

    } catch (err) {

      console.error(
        "Instructor announcements error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load announcements."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {

    setEditingAnnouncement(null);

    setFormData({
      title: "",
      description: "",
      type: "General",
      audience: "Course",
      course: courses.length > 0
        ? courses[0]._id
        : "",
      status: "Active",
    });

    setError("");

    setShowModal(true);
  };


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (announcement) => {

    setEditingAnnouncement(
      announcement
    );

    setFormData({
      title: announcement.title || "",

      description:
        announcement.description || "",

      type:
        announcement.type || "General",

      audience:
        announcement.audience || "Course",

      course:
        announcement.course?._id ||
        announcement.course ||
        "",

      status:
        announcement.status || "Active",
    });

    setError("");

    setShowModal(true);
  };


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    if (submitting) return;

    setShowModal(false);

    setEditingAnnouncement(null);

    setError("");
  };


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    if (!formData.title.trim()) {

      setError(
        "Please enter an announcement title."
      );

      return;
    }


    if (!formData.description.trim()) {

      setError(
        "Please enter announcement details."
      );

      return;
    }


    if (!formData.course) {

      setError(
        "Please select a course."
      );

      return;
    }


    try {

      setSubmitting(true);


      const payload = {
        title:
          formData.title.trim(),

        description:
          formData.description.trim(),

        type:
          formData.type,

        audience:
          "Course",

        course:
          formData.course,

        status:
          formData.status,
      };


      if (editingAnnouncement) {

        const response =
          await updateInstructorAnnouncement(
            editingAnnouncement._id,
            payload
          );


        setAnnouncements((prev) =>
          prev.map((item) =>
            item._id ===
            editingAnnouncement._id
              ? response.data.announcement
              : item
          )
        );

      } else {

        const response =
          await createInstructorAnnouncement(
            payload
          );


        setAnnouncements((prev) => [
          response.data.announcement,
          ...prev,
        ]);
      }


      closeModal();

    } catch (err) {

      console.error(
        "Announcement save error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to save announcement."
      );

    } finally {

      setSubmitting(false);

    }
  };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this announcement?"
      );


    if (!confirmed) return;


    try {

      await deleteInstructorAnnouncement(id);

      setAnnouncements((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

    } catch (err) {

      console.error(
        "Delete announcement error:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to delete announcement."
      );
    }
  };


  // ==========================================
  // FILTER ANNOUNCEMENTS
  // ==========================================

  const filteredAnnouncements =
    announcements.filter((announcement) => {

      const search =
        searchTerm.toLowerCase();

      return (
        announcement.title
          ?.toLowerCase()
          .includes(search) ||

        announcement.description
          ?.toLowerCase()
          .includes(search) ||

        announcement.course?.title
          ?.toLowerCase()
          .includes(search)
      );
    });


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {

    if (!date) return "No date";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="instructor-announcements-page">

        <div className="instructor-announcements-loading">

          <FaBullhorn />

          <h2>
            Loading announcements...
          </h2>

          <p>
            Please wait while we load your announcements.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="instructor-announcements-page">


      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="instructor-announcements-header">

        <div>

          <div className="instructor-page-title">

            <div className="instructor-page-title-icon">

              <FaBullhorn />

            </div>

            <div>

              <h1>
                Announcements
              </h1>

              <p>
                Communicate important updates
                with your students.
              </p>

            </div>

          </div>

        </div>


        <button
          type="button"
          className="instructor-create-announcement-btn"
          onClick={openCreateModal}
        >

          <FaPlus />

          Create Announcement

        </button>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && !showModal && (

        <div className="instructor-announcement-error">

          <FaExclamationCircle />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ======================================
          TOOLBAR
      ====================================== */}

      <div className="instructor-announcements-toolbar">

        <div className="instructor-announcement-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>


        <div className="instructor-announcement-count">

          <strong>
            {filteredAnnouncements.length}
          </strong>

          <span>
            Announcement
            {filteredAnnouncements.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

      </div>


      {/* ======================================
          ANNOUNCEMENTS
      ====================================== */}

      {filteredAnnouncements.length === 0 ? (

        <div className="instructor-announcements-empty">

          <div className="instructor-empty-icon">

            <FaBullhorn />

          </div>

          <h2>
            No Announcements Yet
          </h2>

          <p>
            Create your first announcement
            to communicate with your students.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
          >

            <FaPlus />

            Create Announcement

          </button>

        </div>

      ) : (

        <div className="instructor-announcement-list">

          {filteredAnnouncements.map(
            (announcement) => (

              <article
                key={announcement._id}
                className="instructor-announcement-card"
              >

                <div className="instructor-announcement-card-top">

                  <div className="instructor-announcement-type">

                    <span>
                      {announcement.type}
                    </span>

                  </div>

                  <div className="instructor-announcement-actions">

                    <button
                      type="button"
                      title="Edit"
                      onClick={() =>
                        openEditModal(
                          announcement
                        )
                      }
                    >

                      <FaEdit />

                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() =>
                        handleDelete(
                          announcement._id
                        )
                      }
                    >

                      <FaTrash />

                    </button>

                  </div>

                </div>


                <h2>
                  {announcement.title}
                </h2>


                <p className="instructor-announcement-description">

                  {announcement.description}

                </p>


                <div className="instructor-announcement-meta">

                  <div>

                    <FaBookOpen />

                    <span>

                      {announcement.course?.title ||
                        "Course"}

                    </span>

                  </div>


                  <div>

                    <FaCalendarAlt />

                    <span>

                      {formatDate(
                        announcement.createdAt
                      )}

                    </span>

                  </div>

                </div>

              </article>

            )
          )}

        </div>

      )}


      {/* ======================================
          CREATE / EDIT MODAL
      ====================================== */}

      {showModal && (

        <div
          className="instructor-announcement-modal-overlay"
          onMouseDown={closeModal}
        >

          <div
            className="instructor-announcement-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="instructor-announcement-modal-header">

              <div>

                <h2>

                  {editingAnnouncement
                    ? "Edit Announcement"
                    : "Create Announcement"}

                </h2>

                <p>

                  Share an important update
                  with your students.

                </p>

              </div>


              <button
                type="button"
                className="instructor-announcement-close"
                onClick={closeModal}
                disabled={submitting}
              >

                <FaTimes />

              </button>

            </div>


            {error && (

              <div className="instructor-announcement-modal-error">

                <FaExclamationCircle />

                <span>
                  {error}
                </span>

              </div>

            )}


            <form
              className="instructor-announcement-form"
              onSubmit={handleSubmit}
            >

              {/* TITLE */}

              <div className="instructor-form-group">

                <label>
                  Announcement Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter announcement title"
                  disabled={submitting}
                />

              </div>


              {/* COURSE */}

              <div className="instructor-form-group">

                <label>
                  Course
                </label>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={submitting}
                >

                  <option value="">
                    Select a course
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


              {/* TYPE */}

              <div className="instructor-form-group">

                <label>
                  Announcement Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={submitting}
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


              {/* DESCRIPTION */}

              <div className="instructor-form-group">

                <label>
                  Announcement Details
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write your announcement..."
                  rows="6"
                  disabled={submitting}
                />

              </div>


              {/* ACTIONS */}

              <div className="instructor-announcement-form-actions">

                <button
                  type="button"
                  className="instructor-announcement-cancel-btn"
                  onClick={closeModal}
                  disabled={submitting}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="instructor-announcement-submit-btn"
                  disabled={submitting}
                >

                  {submitting
                    ? "Saving..."
                    : editingAnnouncement
                    ? "Update Announcement"
                    : "Publish Announcement"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default InstructorAnnouncements;