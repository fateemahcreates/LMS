import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
} from "react-icons/fa";

function ProfileSettings() {
  return (
    <div className="settings-section">

      <div className="settings-section-header">
        <div>
          <h2>Profile Information</h2>

          <p>
            Manage your personal information and account details.
          </p>
        </div>

        <div className="settings-section-icon">
          <FaUser />
        </div>
      </div>


      <div className="settings-form">

        <div className="settings-form-row">

          <div className="settings-field">

            <label>
              Full Name
            </label>

            <div className="settings-input-wrapper">

              <FaUser />

              <input
                type="text"
                placeholder="Enter your full name"
              />

            </div>

          </div>


          <div className="settings-field">

            <label>
              Email Address
            </label>

            <div className="settings-input-wrapper">

              <FaEnvelope />

              <input
                type="email"
                placeholder="Enter your email"
              />

            </div>

          </div>

        </div>


        <div className="settings-form-row">

          <div className="settings-field">

            <label>
              Phone Number
            </label>

            <div className="settings-input-wrapper">

              <FaPhone />

              <input
                type="text"
                placeholder="Enter your phone number"
              />

            </div>

          </div>


          <div className="settings-field">

            <label>
              Student / Staff ID
            </label>

            <div className="settings-input-wrapper">

              <FaIdCard />

              <input
                type="text"
                placeholder="Your ID"
                disabled
              />

            </div>

          </div>

        </div>


        <div className="settings-field">

          <label>
            Address
          </label>

          <div className="settings-input-wrapper">

            <FaMapMarkerAlt />

            <input
              type="text"
              placeholder="Enter your address"
            />

          </div>

        </div>


        <div className="settings-field">

          <label>
            Bio
          </label>

          <textarea
            rows="5"
            placeholder="Tell us a little about yourself..."
          />

        </div>


        <div className="settings-form-actions">

          <button
            type="button"
            className="settings-cancel-btn"
          >
            Cancel
          </button>

          <button
            type="button"
            className="settings-save-btn"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProfileSettings;