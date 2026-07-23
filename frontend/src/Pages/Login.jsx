import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { notify } from "../utils/notify";

import "../styles/Login.css";

import {
  FaGraduationCap,
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

  // ==========================
  // Handle Input Change
  // ==========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==========================
  // Handle Login
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (!formData.email || !formData.password) {
      notify.warning("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      // Save JWT Token
      localStorage.setItem("token", res.data.token);

      // Save Logged-in User
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Success Notification
      notify.success("Login successful. Welcome back!");

      // Redirect based on role
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/");
        } else if (res.data.user.role === "student") {
          navigate("/student");
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
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">
          <div className="logo-circle">
            <FaGraduationCap />
          </div>

          <h1>Learning Management System</h1>

          <p>
            Manage students, courses, instructors, and academic records
            from one modern dashboard.
          </p>

          <div className="login-features">
            <div className="feature">
              ✓ Student Management
            </div>

            <div className="feature">
              ✓ Course Management
            </div>

            <div className="feature">
              ✓ Analytics Dashboard
            </div>

            <div className="feature">
              ✓ Secure Authentication
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-card">

          <div className="login-header">
            <h2>Welcome Back</h2>

            <p>
              Sign in to continue to your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
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

            {/* Remember Me */}
            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                Remember Me
              </label>

              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              <FaSignInAlt />

              <span>
                {loading ? "Signing In..." : "Sign In"}
              </span>
            </button>

          </form>

          <div className="login-footer">

            <p>
              Don't have an account?
              <Link
                to="/register"
                className="register-link"
              >
                Create Account
              </Link>
            </p>

            {/*
            <div className="demo-account">
              <h4>Demo Account</h4>

              <p>Email: admin@lms.com</p>

              <p>Password: Password@123</p>
            </div>
            */}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;