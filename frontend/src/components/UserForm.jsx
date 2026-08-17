import { useState } from "react";

import {
  createUser,
  updateUser,
} from "../services/userService";

import { notify } from "../utils/notify";

import "../styles/UserForm.css";

function UserForm({
  formData,
  setFormData,
  editingUser,
  refreshUsers,
  closeDrawer,
}) {
  // =====================================
  // INITIAL STATE
  // =====================================

  const initialState = {
    // ===================================
    // ACCOUNT INFORMATION
    // ===================================

    name: "",
    email: "",
    password: "",
    role: "student",

    // ===================================
    // PERSONAL INFORMATION
    // ===================================

    gender: "",
    dateOfBirth: "",
    phone: "",
    nationality: "",
    address: "",
    bio: "",
    avatar: "",

    // ===================================
    // STUDENT INFORMATION
    // ===================================

    program: "",
    cohort: "",

    // ===================================
    // PARENT / GUARDIAN INFORMATION
    // ===================================

    parentPhone: "",
    guardianPhone: "",

    // ===================================
    // ACCOUNT STATUS
    // ===================================

    status: "active",
  };

  const [loading, setLoading] = useState(false);

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      // Clear student-only information
      // when changing to another role
      ...(name === "role" && value !== "student"
        ? {
            program: "",
            cohort: "",
            parentPhone: "",
            guardianPhone: "",
          }
        : {}),
    }));
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (editingUser) {
        await updateUser(
          editingUser._id,
          formData
        );

        notify.success(
          "User updated successfully."
        );
      } else {
        await createUser(formData);

        notify.success(
          "User created successfully."
        );
      }

      // Refresh user table
      await refreshUsers();

      // Reset form
      setFormData({
        ...initialState,
      });

      // Close drawer
      closeDrawer();

    } catch (error) {
      console.error(
        "User form submission error:",
        error
      );

      notify.apiError(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="user-form"
      onSubmit={handleSubmit}
    >

      {/* =====================================
          ACCOUNT INFORMATION
      ===================================== */}

      <h2>Account Information</h2>

      {/* FULL NAME */}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name || ""}
        onChange={handleChange}
        required
      />

      {/* EMAIL */}

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email || ""}
        onChange={handleChange}
        required
      />

      {/* PASSWORD */}

      <input
        type="password"
        name="password"
        placeholder={
          editingUser
            ? "Leave blank to keep current password"
            : "Password"
        }
        value={formData.password || ""}
        onChange={handleChange}
        required={!editingUser}
      />

      {/* ROLE */}

      <select
        name="role"
        value={formData.role || "student"}
        onChange={handleChange}
        required
      >
        <option value="student">
          Student
        </option>

        <option value="instructor">
          Instructor
        </option>

        <option value="admin">
          Administrator
        </option>
      </select>


      {/* =====================================
          PERSONAL INFORMATION
      ===================================== */}

      <hr />

      <h2>Personal Information</h2>

      {/* GENDER */}

      <select
        name="gender"
        value={formData.gender || ""}
        onChange={handleChange}
      >
        <option value="">
          Select Gender
        </option>

        <option value="Male">
          Male
        </option>

        <option value="Female">
          Female
        </option>

        <option value="Other">
          Other
        </option>
      </select>

      {/* DATE OF BIRTH */}

      <input
        type="date"
        name="dateOfBirth"
        value={
          formData.dateOfBirth || ""
        }
        onChange={handleChange}
      />

      {/* PHONE */}

      <input
        type="tel"
        name="phone"
        placeholder="Student Phone Number"
        value={formData.phone || ""}
        onChange={handleChange}
      />

      {/* NATIONALITY */}

      <input
        type="text"
        name="nationality"
        placeholder="Nationality"
        value={
          formData.nationality || ""
        }
        onChange={handleChange}
      />

      {/* ADDRESS */}

      <textarea
        name="address"
        placeholder="Address"
        value={formData.address || ""}
        onChange={handleChange}
        rows="3"
      />


      {/* =====================================
          STUDENT INFORMATION
      ===================================== */}

      {formData.role === "student" && (
        <>
          <hr />

          <h2>
            Student Information
          </h2>

          {/* PROGRAM */}

          <select
            name="program"
            value={
              formData.program || ""
            }
            onChange={handleChange}
            required
          >
            <option value="">
              Select Program
            </option>

            <option value="Software Engineering">
              Software Engineering
            </option>

            <option value="Cybersecurity">
              Cybersecurity
            </option>

            <option value="Data Science">
              Data Science
            </option>

            <option value="Digital Marketing">
              Digital Marketing
            </option>

            <option value="Graphic Design">
              Graphic Design
            </option>
          </select>


          {/* COHORT */}

          <select
            name="cohort"
            value={
              formData.cohort || ""
            }
            onChange={handleChange}
            required
          >
            <option value="">
              Select Cohort
            </option>

            <option value="July 2026">
              July 2026
            </option>

            <option value="August 2026">
              August 2026
            </option>

            <option value="September 2026">
              September 2026
            </option>

            <option value="October 2026">
              October 2026
            </option>
          </select>


          {/* =================================
              PARENT / GUARDIAN
          ================================= */}

          <h3>
            Parent & Guardian Information
          </h3>

          {/* PARENT PHONE */}

          <input
            type="tel"
            name="parentPhone"
            placeholder="Parent Phone Number"
            value={
              formData.parentPhone || ""
            }
            onChange={handleChange}
          />

          {/* GUARDIAN PHONE */}

          <input
            type="tel"
            name="guardianPhone"
            placeholder="Guardian Phone Number"
            value={
              formData.guardianPhone || ""
            }
            onChange={handleChange}
          />
        </>
      )}


      {/* =====================================
          ACCOUNT STATUS
      ===================================== */}

      <hr />

      <h2>
        Account Status
      </h2>

      <select
        name="status"
        value={
          formData.status || "active"
        }
        onChange={handleChange}
        required
      >
        <option value="active">
          Active
        </option>

        <option value="inactive">
          Inactive
        </option>

        <option value="suspended">
          Suspended
        </option>
      </select>


      {/* =====================================
          SUBMIT BUTTON
      ===================================== */}

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? editingUser
            ? "Updating..."
            : "Creating..."
          : editingUser
          ? "Update User"
          : "Create User"}
      </button>

    </form>
  );
}

export default UserForm;