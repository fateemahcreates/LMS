import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  FaUser,
  FaLock,
  FaBell,
  FaCog,
  FaSave,
} from "react-icons/fa";

import {
  getSettings,
  updateProfile,
  changePassword,
  updateNotifications,
} from "../../services/settingsService";

import "../../styles/Settings.css";

function Settings() {
  // ============================================================
  // URL SETTINGS SECTION
  // ============================================================

  const [searchParams, setSearchParams] =
    useSearchParams();

  const sectionFromUrl =
    searchParams.get("section");

  // ============================================================
  // ACTIVE SETTINGS SECTION
  // ============================================================

  const [activeSection, setActiveSection] =
    useState(
      sectionFromUrl || "profile"
    );

  // ============================================================
  // LOADING
  // ============================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ============================================================
  // USER / SETTINGS DATA
  // ============================================================

  const [user, setUser] =
    useState(null);

  // ============================================================
  // PROFILE FORM
  // ============================================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    bio: "",
  });

  // ============================================================
  // PASSWORD FORM
  // ============================================================

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ============================================================
  // NOTIFICATION SETTINGS
  // ============================================================

  const [notifications, setNotifications] =
    useState({
      emailNotifications: true,
      assignmentNotifications: true,
      announcementNotifications: true,
      courseNotifications: true,
      systemNotifications: true,
    });

  // ============================================================
  // MESSAGE
  // ============================================================

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });

  // ============================================================
  // VALID SETTINGS SECTIONS
  // ============================================================

  const validSections = [
    "profile",
    "security",
    "notifications",
    "account",
  ];

  // ============================================================
  // SYNC ACTIVE SECTION WITH URL
  // ============================================================

  useEffect(() => {
    if (
      sectionFromUrl &&
      validSections.includes(sectionFromUrl)
    ) {
      setActiveSection(
        sectionFromUrl
      );
    } else {
      setActiveSection("profile");
    }
  }, [sectionFromUrl]);

  // ============================================================
  // CHANGE SETTINGS SECTION
  // ============================================================

  const changeSection = (section) => {
    setActiveSection(section);

    setSearchParams({
      section,
    });

    setMessage({
      type: "",
      text: "",
    });
  };

  // ============================================================
  // LOAD SETTINGS
  // ============================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response =
          await getSettings();

        const data =
          response.data;

        const settingsUser =
          data.user || data;

        setUser(settingsUser);

        // ------------------------------------------
        // PROFILE
        // ------------------------------------------

        setProfile({
          name:
            settingsUser.name || "",

          email:
            settingsUser.email || "",

          phone:
            settingsUser.phone || "",

          gender:
            settingsUser.gender || "",

          dateOfBirth:
            settingsUser.dateOfBirth
              ? settingsUser.dateOfBirth.substring(
                  0,
                  10
                )
              : "",

          nationality:
            settingsUser.nationality || "",

          address:
            settingsUser.address || "",

          bio:
            settingsUser.bio || "",
        });

        // ------------------------------------------
        // NOTIFICATIONS
        // ------------------------------------------

        if (
          data.notifications
        ) {
          setNotifications({
            emailNotifications:
              data.notifications
                .emailNotifications ??
              true,

            assignmentNotifications:
              data.notifications
                .assignmentNotifications ??
              true,

            announcementNotifications:
              data.notifications
                .announcementNotifications ??
              true,

            courseNotifications:
              data.notifications
                .courseNotifications ??
              true,

            systemNotifications:
              data.notifications
                .systemNotifications ??
              true,
          });
        }
      } catch (error) {
        console.error(
          "Settings loading error:",
          error
        );

        // ------------------------------------------
        // FALLBACK TO LOCAL STORAGE
        // ------------------------------------------

        try {
          const storedUser =
            JSON.parse(
              localStorage.getItem(
                "user"
              )
            );

          if (storedUser) {
            setUser(storedUser);

            setProfile({
              name:
                storedUser.name || "",

              email:
                storedUser.email || "",

              phone:
                storedUser.phone || "",

              gender:
                storedUser.gender || "",

              dateOfBirth:
                storedUser.dateOfBirth
                  ? storedUser.dateOfBirth.substring(
                      0,
                      10
                    )
                  : "",

              nationality:
                storedUser.nationality ||
                "",

              address:
                storedUser.address || "",

              bio:
                storedUser.bio || "",
            });
          }
        } catch (storageError) {
          console.error(
            "Unable to load local user:",
            storageError
          );
        }

        setMessage({
          type: "error",
          text:
            "Unable to load some settings.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ============================================================
  // PROFILE INPUT
  // ============================================================

  const handleProfileChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // PASSWORD INPUT
  // ============================================================

  const handlePasswordChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setPassword((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // NOTIFICATION TOGGLE
  // ============================================================

  const handleNotificationChange = (
    event
  ) => {
    const {
      name,
      checked,
    } = event.target;

    setNotifications(
      (previous) => ({
        ...previous,
        [name]: checked,
      })
    );
  };

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleSaveProfile =
    async (event) => {
      event.preventDefault();

      setSaving(true);

      setMessage({
        type: "",
        text: "",
      });

      try {
        const response =
          await updateProfile(
            profile
          );

        const updatedUser =
          response.data.user ||
          response.data;

        setUser(updatedUser);

        // ------------------------------------------
        // UPDATE LOCAL STORAGE
        // ------------------------------------------

        const storedUser =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          ) || {};

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            ...updatedUser,
          })
        );

        setMessage({
          type: "success",
          text:
            response.data.message ||
            "Profile updated successfully.",
        });
      } catch (error) {
        console.error(
          "Profile update error:",
          error
        );

        setMessage({
          type: "error",
          text:
            error.response?.data
              ?.message ||
            "Unable to update profile.",
        });
      } finally {
        setSaving(false);
      }
    };

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const handleChangePassword =
    async (event) => {
      event.preventDefault();

      if (
        password.newPassword !==
        password.confirmPassword
      ) {
        setMessage({
          type: "error",
          text:
            "New password and confirmation password do not match.",
        });

        return;
      }

      if (
        password.newPassword.length <
        6
      ) {
        setMessage({
          type: "error",
          text:
            "Password must contain at least 6 characters.",
        });

        return;
      }

      setSaving(true);

      setMessage({
        type: "",
        text: "",
      });

      try {
        const response =
          await changePassword({
            currentPassword:
              password.currentPassword,

            newPassword:
              password.newPassword,

            confirmPassword:
              password.confirmPassword,
          });

        setMessage({
          type: "success",
          text:
            response.data.message ||
            "Password changed successfully.",
        });

        setPassword({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error(
          "Password change error:",
          error
        );

        setMessage({
          type: "error",
          text:
            error.response?.data
              ?.message ||
            "Unable to change password.",
        });
      } finally {
        setSaving(false);
      }
    };

  // ============================================================
  // SAVE NOTIFICATIONS
  // ============================================================

  const handleSaveNotifications =
    async (event) => {
      event.preventDefault();

      setSaving(true);

      setMessage({
        type: "",
        text: "",
      });

      try {
        const response =
          await updateNotifications(
            notifications
          );

        setMessage({
          type: "success",
          text:
            response.data.message ||
            "Notification preferences updated successfully.",
        });
      } catch (error) {
        console.error(
          "Notification update error:",
          error
        );

        setMessage({
          type: "error",
          text:
            error.response?.data
              ?.message ||
            "Unable to update notification preferences.",
        });
      } finally {
        setSaving(false);
      }
    };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          <div className="settings-loading-spinner"></div>

          <p>
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="settings-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="settings-header">

        <div>

          <span className="settings-eyebrow">
            ACCOUNT MANAGEMENT
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Manage your profile, security,
            notifications and account preferences.
          </p>

        </div>

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="settings-layout">

        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside className="settings-sidebar">

          {/* PROFILE */}

          <button
            type="button"
            className={
              activeSection === "profile"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              changeSection("profile")
            }
          >

            <FaUser />

            <span>
              Profile
            </span>

          </button>

          {/* SECURITY */}

          <button
            type="button"
            className={
              activeSection === "security"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              changeSection("security")
            }
          >

            <FaLock />

            <span>
              Security
            </span>

          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            className={
              activeSection ===
              "notifications"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              changeSection(
                "notifications"
              )
            }
          >

            <FaBell />

            <span>
              Notifications
            </span>

          </button>

          {/* ACCOUNT */}

          <button
            type="button"
            className={
              activeSection === "account"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              changeSection("account")
            }
          >

            <FaCog />

            <span>
              Account
            </span>

          </button>

        </aside>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <main className="settings-content">

          {/* ==================================================
              MESSAGE
          ================================================== */}

          {message.text && (
            <div
              className={
                message.type ===
                "success"
                  ? "settings-message success"
                  : "settings-message error"
              }
            >
              {message.text}
            </div>
          )}

          {/* ==================================================
              PROFILE
          ================================================== */}

          {activeSection ===
            "profile" && (
            <section className="settings-section">

              <div className="settings-section-header">

                <div>

                  <h2>
                    Profile Information
                  </h2>

                  <p>
                    Update your personal
                    information and profile
                    details.
                  </p>

                </div>

              </div>

              <form
                className="settings-form"
                onSubmit={
                  handleSaveProfile
                }
              >

                <div className="settings-avatar-section">

                  <div className="settings-avatar">

                    {profile.name
                      ? profile.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>

                  <div>

                    <h3>
                      {profile.name ||
                        "User"}
                    </h3>

                    <p>
                      {user?.role ||
                        "User"}
                    </p>

                  </div>

                </div>

                <div className="settings-form-grid">

                  {/* FULL NAME */}

                  <div className="settings-form-group">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        profile.name
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter your full name"
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="settings-form-group">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        profile.email
                      }
                      disabled
                    />

                    <small>
                      Email address cannot
                      be changed here.
                    </small>

                  </div>

                  {/* PHONE */}

                  <div className="settings-form-group">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={
                        profile.phone
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter phone number"
                    />

                  </div>

                  {/* GENDER */}

                  <div className="settings-form-group">

                    <label>
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={
                        profile.gender
                      }
                      onChange={
                        handleProfileChange
                      }
                    >

                      <option value="">
                        Select gender
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

                  </div>

                  {/* DATE OF BIRTH */}

                  <div className="settings-form-group">

                    <label>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={
                        profile.dateOfBirth
                      }
                      onChange={
                        handleProfileChange
                      }
                    />

                  </div>

                  {/* NATIONALITY */}

                  <div className="settings-form-group">

                    <label>
                      Nationality
                    </label>

                    <input
                      type="text"
                      name="nationality"
                      value={
                        profile.nationality
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter nationality"
                    />

                  </div>

                  {/* ADDRESS */}

                  <div className="settings-form-group full-width">

                    <label>
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={
                        profile.address
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Enter your address"
                    />

                  </div>

                  {/* BIO */}

                  <div className="settings-form-group full-width">

                    <label>
                      Bio
                    </label>

                    <textarea
                      name="bio"
                      value={
                        profile.bio
                      }
                      onChange={
                        handleProfileChange
                      }
                      placeholder="Tell us a little about yourself..."
                      rows="5"
                    />

                  </div>

                </div>

                <div className="settings-form-footer">

                  <button
                    type="submit"
                    className="settings-save-btn"
                    disabled={saving}
                  >

                    <FaSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                </div>

              </form>

            </section>
          )}

          {/* ==================================================
              SECURITY
          ================================================== */}

          {activeSection ===
            "security" && (
            <section className="settings-section">

              <div className="settings-section-header">

                <div>

                  <h2>
                    Security
                  </h2>

                  <p>
                    Keep your account secure by
                    updating your password
                    regularly.
                  </p>

                </div>

              </div>

              <form
                className="settings-form"
                onSubmit={
                  handleChangePassword
                }
              >

                <div className="settings-form-grid">

                  <div className="settings-form-group full-width">

                    <label>
                      Current Password
                    </label>

                    <input
                      type="password"
                      name="currentPassword"
                      value={
                        password.currentPassword
                      }
                      onChange={
                        handlePasswordChange
                      }
                      placeholder="Enter current password"
                      required
                    />

                  </div>

                  <div className="settings-form-group">

                    <label>
                      New Password
                    </label>

                    <input
                      type="password"
                      name="newPassword"
                      value={
                        password.newPassword
                      }
                      onChange={
                        handlePasswordChange
                      }
                      placeholder="Enter new password"
                      minLength="6"
                      required
                    />

                  </div>

                  <div className="settings-form-group">

                    <label>
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      name="confirmPassword"
                      value={
                        password.confirmPassword
                      }
                      onChange={
                        handlePasswordChange
                      }
                      placeholder="Confirm new password"
                      minLength="6"
                      required
                    />

                  </div>

                </div>

                <div className="settings-security-note">

                  <FaLock />

                  <div>

                    <strong>
                      Password security
                    </strong>

                    <p>
                      Use at least 6 characters.
                      A strong password should
                      combine letters, numbers
                      and special characters.
                    </p>

                  </div>

                </div>

                <div className="settings-form-footer">

                  <button
                    type="submit"
                    className="settings-save-btn"
                    disabled={saving}
                  >

                    <FaLock />

                    {saving
                      ? "Updating..."
                      : "Change Password"}

                  </button>

                </div>

              </form>

            </section>
          )}

          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          {activeSection ===
            "notifications" && (
            <section className="settings-section">

              <div className="settings-section-header">

                <div>

                  <h2>
                    Notifications
                  </h2>

                  <p>
                    Choose the notifications you
                    want to receive.
                  </p>

                </div>

              </div>

              <form
                className="settings-form"
                onSubmit={
                  handleSaveNotifications
                }
              >

                <div className="notification-list">

                  {/* EMAIL */}

                  <label className="notification-item">

                    <div>

                      <strong>
                        Email Notifications
                      </strong>

                      <p>
                        Receive important LMS
                        notifications by email.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={
                        notifications.emailNotifications
                      }
                      onChange={
                        handleNotificationChange
                      }
                    />

                  </label>

                  {/* ASSIGNMENT */}

                  <label className="notification-item">

                    <div>

                      <strong>
                        Assignment Notifications
                      </strong>

                      <p>
                        Receive notifications about
                        assignments and submissions.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      name="assignmentNotifications"
                      checked={
                        notifications.assignmentNotifications
                      }
                      onChange={
                        handleNotificationChange
                      }
                    />

                  </label>

                  {/* ANNOUNCEMENT */}

                  <label className="notification-item">

                    <div>

                      <strong>
                        Announcement Notifications
                      </strong>

                      <p>
                        Receive notifications when
                        new announcements are posted.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      name="announcementNotifications"
                      checked={
                        notifications.announcementNotifications
                      }
                      onChange={
                        handleNotificationChange
                      }
                    />

                  </label>

                  {/* COURSE */}

                  <label className="notification-item">

                    <div>

                      <strong>
                        Course Notifications
                      </strong>

                      <p>
                        Receive updates about your
                        courses and enrollments.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      name="courseNotifications"
                      checked={
                        notifications.courseNotifications
                      }
                      onChange={
                        handleNotificationChange
                      }
                    />

                  </label>

                  {/* SYSTEM */}

                  <label className="notification-item">

                    <div>

                      <strong>
                        System Notifications
                      </strong>

                      <p>
                        Receive important account,
                        certificate and system
                        notifications.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      name="systemNotifications"
                      checked={
                        notifications.systemNotifications
                      }
                      onChange={
                        handleNotificationChange
                      }
                    />

                  </label>

                </div>

                <div className="settings-form-footer">

                  <button
                    type="submit"
                    className="settings-save-btn"
                    disabled={saving}
                  >

                    <FaBell />

                    {saving
                      ? "Saving..."
                      : "Save Preferences"}

                  </button>

                </div>

              </form>

            </section>
          )}

          {/* ==================================================
              ACCOUNT
          ================================================== */}

          {activeSection ===
            "account" && (
            <section className="settings-section">

              <div className="settings-section-header">

                <div>

                  <h2>
                    Account
                  </h2>

                  <p>
                    View your account information.
                  </p>

                </div>

              </div>

              <div className="account-information">

                <div className="account-info-item">

                  <span>
                    Account Name
                  </span>

                  <strong>
                    {user?.name ||
                      "Not available"}
                  </strong>

                </div>

                <div className="account-info-item">

                  <span>
                    Email Address
                  </span>

                  <strong>
                    {user?.email ||
                      "Not available"}
                  </strong>

                </div>

                <div className="account-info-item">

                  <span>
                    Account Role
                  </span>

                  <strong className="account-role">
                    {user?.role ||
                      "User"}
                  </strong>

                </div>

                <div className="account-info-item">

                  <span>
                    Account Status
                  </span>

                  <strong className="account-status">
                    {user?.status ||
                      "Active"}
                  </strong>

                </div>

                {user?.studentId && (
                  <div className="account-info-item">

                    <span>
                      Student ID
                    </span>

                    <strong>
                      {user.studentId}
                    </strong>

                  </div>
                )}

                <div className="account-info-item">

                  <span>
                    Account Created
                  </span>

                  <strong>
                    {user?.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "Not available"}
                  </strong>

                </div>

              </div>

            </section>
          )}

        </main>

      </div>

    </div>
  );
}

export default Settings;