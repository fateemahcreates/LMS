import { useState } from "react";
import { Link } from "react-router-dom";

import { forgotPassword } from "../services/authService";
import { notify } from "../utils/notify";

import logo from "../assets/GMT Software logo.jpeg";

import {
  FaEnvelope,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";

import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      notify.warning("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      const res = await forgotPassword(email);

      notify.success(res.data.message);

      setEmailSent(true);

    } catch (error) {
      notify.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gmt-forgot-page">

      <div className="gmt-forgot-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="gmt-forgot-left">

          <div className="gmt-forgot-brand">

            <img
              src={logo}
              alt="GMT Software"
              className="gmt-forgot-logo"
            />

            <div>

              <h1>GMT Software Academy</h1>

              <span>
                Learning Management System
              </span>

            </div>

          </div>

          <h2>
            Secure Password Recovery
          </h2>

          <p>
            Forgot your password? No worries.
            We'll send a secure password reset
            link to your registered email so
            you can regain access to your
            account safely.
          </p>

          <div className="gmt-forgot-features">

            <div>✓ Secure Recovery Process</div>

            <div>✓ Email Verification</div>

            <div>✓ One-Time Reset Link</div>

            <div>✓ Enterprise Grade Security</div>

          </div>

        </div>

        {/* =========================
            RIGHT CARD
        ========================= */}

        <div className="gmt-forgot-card">

          {!emailSent ? (

            <>

              <div className="gmt-forgot-header">

                <h2>Forgot Password</h2>

                <p>
                  Enter your registered email
                  address below.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="gmt-forgot-form"
              >

                <div className="gmt-forgot-group">

                  <label>Email Address</label>

                  <div className="gmt-forgot-input">

                    <FaEnvelope />

                    <input
                      type="email"
                      placeholder="john@gmtsoftware.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>

                <button
                  className="gmt-forgot-button"
                  type="submit"
                  disabled={loading}
                >

                  <FaPaperPlane />

                  <span>
                    {loading
                      ? "Sending..."
                      : "Send Reset Link"}
                  </span>

                </button>

              </form>

            </>

          ) : (

            <div className="gmt-reset-success">

              <div className="gmt-success-icon">
                ✓
              </div>

              <h2>Reset Link Sent</h2>

              <p>
                We've sent a password reset
                link to:
              </p>

              <strong>{email}</strong>

              <p>
                Please check your inbox and
                spam folder.
              </p>

            </div>

          )}

          <div className="gmt-forgot-footer">

            <Link to="/login">

              <FaArrowLeft />

              Back to Login

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;