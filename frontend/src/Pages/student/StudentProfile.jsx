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

  console.log("Status:", error.response?.status);
  console.log("Response:", error.response?.data);

  toast.error("Unable to update profile.");
}
};

  return (
    <main className="student-profile-page">

      {/* ================= Header ================= */}

      <div className="profile-card">

        <div className="profile-avatar">

          <img
            src={
              student.avatar ||
              "https://ui-avatars.com/api/?name=Student&background=2563eb&color=fff"
            }
            alt="Profile"
          />

        </div>

        <div className="profile-info">

          <h1>{student.name}</h1>

          <p>{student.email}</p>

          <span className="student-id">
            <FaIdCard />
            {student.studentId || "Not Assigned"}
          </span>

        </div>

      </div>

      {/* ================= Personal Information ================= */}

      <div className="profile-section">

        <div className="section-header">

          <h2>Personal Information</h2>

          <button
  className="edit-btn"
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
                <FaSave /> Save
              </>
            ) : (
              <>
                <FaEdit /> Edit
              </>
            )}
          </button>

        </div>

        <div className="profile-grid">

          <div className="input-group">

            <label>
              <FaUser />
              Full Name
            </label>

            <input
              name="name"
              value={student.name || ""}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              <FaEnvelope />
              Email
            </label>

            <input
              value={student.email || ""}
              disabled
            />

          </div>

          <div className="input-group">

  <label>
    <FaPhone />
    Phone Number
  </label>

  <input
    name="phone"
    value={student.phone || ""}
    disabled={!editing}
    onChange={handleChange}
  />

</div>

<div className="input-group">

  <label>
    <FaIdCard />
    Learning Track
  </label>

  <input
    name="learningTrack"
    value={student.learningTrack || ""}
    disabled={!editing}
    onChange={handleChange}
  />


          </div>

          <div className="input-group">

            <label>
              <FaGlobe />
              Nationality
            </label>

            <input
              name="nationality"
              value={student.nationality || ""}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

          <div className="input-group full-width">

  <label>
    <FaMapMarkerAlt />
    Address
  </label>

  <textarea
    rows="3"
    name="address"
    value={student.address || ""}
    disabled={!editing}
    onChange={handleChange}
  />

</div>

<div className="input-group">

  <label>
    <FaIdCard />
    Course Duration
  </label>

  <input
    name="courseDuration"
    value={student.courseDuration || ""}
    disabled={!editing}
    onChange={handleChange}
  />

</div>

          <div className="input-group full-width">

            <label>Bio</label>

            <textarea
              rows="4"
              name="bio"
              value={student.bio || ""}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

    </main>
  );
}

export default StudentProfile;