import { useEffect, useState } from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaIdCard,
  FaEdit,
  FaSave,
  FaGraduationCap,
  FaCertificate,
  FaChartLine,
  FaClipboardCheck,
  FaClock,
} from "react-icons/fa";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../../services/studentServices";

import { toast } from "react-toastify";

import "../../styles/StudentProfile.css";

function StudentProfile() {

  const [student, setStudent] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {

      const res = await getStudentProfile();

      setStudent(res.data.student || res.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {

    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });

  };

  const handleSave = async () => {

    try {

      await updateStudentProfile(student);

      toast.success("Profile updated successfully.");

      setEditing(false);

      loadProfile();

    } catch (error) {

      console.error(error);

      toast.error("Unable to update profile.");

    }

  };

  return (

    <main className="gsp-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="gsp-header">

        <span className="gsp-tag">
          GMT SOFTWARE ACADEMY
        </span>

        <h1>Student Profile</h1>

        <p>
          Manage your personal information,
          learning profile and account settings.
        </p>

      </div>

      {/* ======================================
          PROFILE LAYOUT
      ====================================== */}

      <div className="gsp-layout">

        {/* ======================================
            LEFT SIDEBAR
        ====================================== */}

        <div className="gsp-sidebar">

          <div className="gsp-avatar-card">

            <div className="gsp-avatar">

              <img
                src={
                  student.avatar ||
                  "https://ui-avatars.com/api/?name=Student&background=C91F26&color=fff"
                }
                alt="Profile"
              />

            </div>

            <h2>
              {student.name || "Student"}
            </h2>

            <p>
              GMT Software Academy
            </p>

            <span className="gsp-id">

              <FaIdCard />

              {student.studentId || "Not Assigned"}

            </span>

            <button
              className="gsp-edit-btn"
              onClick={() => {

                if (editing) {

                  handleSave();

                } else {

                  setEditing(true);

                }

              }}
            >

              {editing ? (
                <>
                  <FaSave />
                  Save Changes
                </>
              ) : (
                <>
                  <FaEdit />
                  Edit Profile
                </>
              )}

            </button>

          </div>

          {/* ======================================
              QUICK STATS
          ====================================== */}

          <div className="gsp-stats">

  <div className="gsp-stat-card">

    <FaCertificate />

    <div>

      <h3>Certificates</h3>

      <strong>
        {student.totalCertificates ?? 0}
      </strong>

    </div>

  </div>

</div>
</div>


        {/* ======================================
            RIGHT CONTENT
        ====================================== */}

        <section className="gsp-content">

          <div className="gsp-card">

            <div className="gsp-card-header">

              <h2>
                Personal Information
              </h2>

            </div>

            <div className="gsp-grid">
                            {/* ===========================
                  FULL NAME
              =========================== */}

              <div className="gsp-group">

                <label>

                  <FaUser />

                  Full Name

                </label>

                <input
                  className="gsp-input"
                  type="text"
                  name="name"
                  value={student.name || ""}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>

              {/* ===========================
                  EMAIL
              =========================== */}

              <div className="gsp-group">

                <label>

                  <FaEnvelope />

                  Email Address

                </label>

                <input
                  className="gsp-input"
                  type="email"
                  value={student.email || ""}
                  disabled
                />

              </div>

              {/* ===========================
                  PHONE
              =========================== */}

              <div className="gsp-group">

                <label>

                  <FaPhone />

                  Phone Number

                </label>

                <input
                  className="gsp-input"
                  type="text"
                  name="phone"
                  value={student.phone || ""}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>

              {/* ===========================
                  STUDENT ID
              =========================== */}

              <div className="gsp-group">

                <label>

                  <FaIdCard />

                  Student ID

                </label>

                <input
                  className="gsp-input"
                  type="text"
                  value={student.studentId || ""}
                  disabled
                />

              </div>

              {/* ===========================
                  LEARNING TRACK
              =========================== */}

              <div className="gsp-group">

                <label>

                  <FaGraduationCap />

                  Learning Track

                </label>

                <input
                  className="gsp-input"
                  type="text"
                  name="learningTrack"
                  value={student.learningTrack || ""}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>

              {/* ===========================
                  NATIONALITY
              =========================== */}

              <div className="gsp-group">

                <label>

                  <FaGlobe />

                  Nationality

                </label>

                <input
                  className="gsp-input"
                  type="text"
                  name="nationality"
                  value={student.nationality || ""}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>

              {/* ===========================
                  COURSE DURATION
              =========================== */}

              <div className="gsp-group">

                <label>

                  <FaClock />

                  Course Duration

                </label>

                <input
                  className="gsp-input"
                  type="text"
                  name="courseDuration"
                  value={student.courseDuration || ""}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>

                            {/* ===========================
                  ADDRESS
              =========================== */}

              <div className="gsp-group gsp-full">

                <label>

                  <FaMapMarkerAlt />

                  Address

                </label>

                <textarea
                  className="gsp-textarea"
                  rows="4"
                  name="address"
                  value={student.address || ""}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>

              {/* ===========================
                  BIO
              =========================== */}

              <div className="gsp-group gsp-full">

                <label>

                  About Me

                </label>

                <textarea
                  className="gsp-textarea"
                  rows="6"
                  name="bio"
                  value={student.bio || ""}
                  disabled={!editing}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                />

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>

  );

}

export default StudentProfile;