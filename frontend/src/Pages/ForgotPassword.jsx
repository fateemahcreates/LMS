import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { FaEnvelope } from "react-icons/fa";

import { forgotPassword } from "../services/authService";

import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const res =
        await forgotPassword(email);

      toast.success(res.data.message);

      setEmail("");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <h2>Forgot Password</h2>

        <p>
          Enter your email address and
          we'll send you a password reset
          link.
        </p>

        <div className="input-group">

          <FaEnvelope />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </button>

        <div className="auth-footer">

          <Link to="/login">
            Back to Login
          </Link>

        </div>

      </form>

    </div>
  );
}

export default ForgotPassword;