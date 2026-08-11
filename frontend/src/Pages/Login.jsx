import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/authService";
import { notify } from "../utils/notify";

import "../styles/Login.css";

import logo from "../assets/GMT Software logo.jpeg";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      notify.warning(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      notify.success(
        "Login successful. Welcome back!"
      );

      setTimeout(() => {
        switch (res.data.user.role.toLowerCase()) {
          case "admin":
            navigate("/");
            break;

          case "instructor":
            navigate("/instructor");
            break;

          case "student":
            navigate("/student");
            break;

          default:
            notify.error("Unknown user role.");
            navigate("/login");
        }
      }, 800);

    } catch (error) {
      notify.error(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gmt-login-page">

      <div className="gmt-login-container">

        {/* =====================================
            LEFT BRANDING
        ===================================== */}

        <div className="gmt-login-left">

          <div className="gmt-login-brand">

            <img
              src={logo}
              alt="GMT Software"
              className="gmt-login-logo"
            />

            <div className="gmt-login-brand-text">

              <h1>
                GMT Software Academy
              </h1>

              <span>
                Learning Management System
              </span>

            </div>

          </div>

          <h2 className="gmt-login-title">
            Empowering Digital Learning Excellence
          </h2>

          <p className="gmt-login-description">
            A modern Learning Management System
            designed to connect administrators,
            instructors and students through one
            intelligent digital learning platform.
          </p>

          <div className="gmt-login-features">

            <div className="gmt-login-feature">
              ✓ Student Management
            </div>

            <div className="gmt-login-feature">
              ✓ Course Management
            </div>

            <div className="gmt-login-feature">
              ✓ Instructor Portal
            </div>

            <div className="gmt-login-feature">
              ✓ Secure Authentication
            </div>

          </div>

        </div>

        {/* =====================================
            LOGIN CARD
        ===================================== */}

        <div className="gmt-login-card">

          <div className="gmt-login-header">

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to continue to your dashboard.
            </p>

          </div>

          <form
            className="gmt-login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="gmt-login-group">

              <label className="gmt-login-label">
                Email Address
              </label>

              <div className="gmt-login-input-wrapper">

                <FaEnvelope className="gmt-login-input-icon" />

                <input
                  className="gmt-login-input"
                  type="email"
                  name="email"
                  placeholder="admin@gmtsoftware.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="gmt-login-group">

              <label className="gmt-login-label">
                Password
              </label>

              <div className="gmt-login-input-wrapper">

                <FaLock className="gmt-login-input-icon" />

                <input
                  className="gmt-login-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="gmt-login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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

            {/* OPTIONS */}

            <div className="gmt-login-options">

              <label className="gmt-login-remember">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                <span>
                  Remember Me
                </span>

              </label>

              <Link
                to="/forgot-password"
                className="gmt-login-forgot"
              >
                Forgot Password?
              </Link>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="gmt-login-button"
              disabled={loading}
            >

              <FaSignInAlt />

              <span>
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </span>

            </button>

          </form>

          <div className="gmt-login-footer">

  <p className="gmt-login-admin-note">
    Student accounts are created by the Academy Administration.
  </p>

  <p className="gmt-login-contact">
    If you have not received your login credentials,
    please contact your administrator.
  </p>

</div>

        </div>

      </div>

    </div>
  );
}

export default Login;