import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { notify } from "../utils/notify";

import "../styles/Register.css";

import {
  FaGraduationCap,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================
  // Handle Input Change
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Handle Register
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      notify.warning("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      notify.warning("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      notify.success(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
  notify.apiError(error);
}
  }

  return (
    <div className="register-page">
      <div className="register-container">

        {/* Left Side */}
        <div className="register-left">

          <div className="logo-circle">
            <FaGraduationCap />
          </div>

          <h1>Learning Management System</h1>

          <p>
            Create your administrator account to manage
            students, courses, instructors and academic
            records.
          </p>

          <div className="register-features">
            <div className="feature">
              ✓ Secure Authentication
            </div>

            <div className="feature">
              ✓ Student Management
            </div>

            <div className="feature">
              ✓ Course Management
            </div>

            <div className="feature">
              ✓ Analytics Dashboard
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="register-card">

          <div className="register-header">
            <h2>Create Account</h2>

            <p>
              Register as an administrator.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="input-group">

              <label>Full Name</label>

              <div className="input-wrapper">

                <FaUser className="input-icon" />

                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Email */}
            <div className="input-group">

              <label>Email Address</label>

              <div className="input-wrapper">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="admin@lms.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Password */}
            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">

                <FaLock className="input-icon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}
            <div className="input-group">

              <label>Confirm Password</label>

              <div className="input-wrapper">

                <FaLock className="input-icon" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              <FaUserPlus />

              <span>
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </span>

            </button>

          </form>

          <div className="login-link">

            Already have an account?

            <Link to="/login">
              Sign In
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;