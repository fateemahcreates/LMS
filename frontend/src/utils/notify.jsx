import { toast } from "react-toastify";

const options = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

export const notify = {
  success: (message) =>
    toast.success(message, options),

  error: (message) =>
    toast.error(message, options),

  warning: (message) =>
    toast.warning(message, options),

  info: (message) =>
    toast.info(message, options),

  apiError: (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong.";

    toast.error(message, options);
  },

  // ==========================================
  // Logout Confirmation
  // ==========================================

  confirmLogout: (onConfirm) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to logout?</p>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>

            <button
              onClick={closeToast}
              style={{
                background: "#e5e7eb",
                color: "#111827",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        ...options,
        autoClose: false,
        closeOnClick: false,
      }
    );
  },

  // ==========================================
  // Delete Confirmation
  // ==========================================

  confirmDelete: (onConfirm) => {
    toast.warning(
      ({ closeToast }) => (
        <div>
          <p>
            Are you sure you want to delete this item?
          </p>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>

            <button
              onClick={closeToast}
              style={{
                background: "#e5e7eb",
                color: "#111827",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        ...options,
        autoClose: false,
        closeOnClick: false,
      }
    );
  },
};