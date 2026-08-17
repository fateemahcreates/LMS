import { toast } from "react-toastify";

// ============================================================
// DEFAULT TOAST OPTIONS
// ============================================================

const options = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};


// ============================================================
// CONFIRMATION TOAST OPTIONS
// ============================================================

const confirmOptions = {
  ...options,
  autoClose: false,
  closeOnClick: false,
  closeButton: false,
};


// ============================================================
// NOTIFY
// ============================================================

export const notify = {

  // ==========================================================
  // SUCCESS
  // ==========================================================

  success: (message) =>
    toast.success(
      message,
      options
    ),


  // ==========================================================
  // ERROR
  // ==========================================================

  error: (message) =>
    toast.error(
      message,
      options
    ),


  // ==========================================================
  // WARNING
  // ==========================================================

  warning: (message) =>
    toast.warning(
      message,
      options
    ),


  // ==========================================================
  // INFO
  // ==========================================================

  info: (message) =>
    toast.info(
      message,
      options
    ),


  // ==========================================================
  // API ERROR
  // ==========================================================

  apiError: (error) => {

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong.";

    toast.error(
      message,
      options
    );
  },


  // ==========================================================
  // GENERIC CONFIRMATION
  // ==========================================================

  confirm: ({
    title = "Are you sure?",
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning",
    onConfirm,
    onCancel,
  }) => {

    const toastType =
      type === "danger"
        ? toast.error
        : type === "success"
        ? toast.success
        : type === "info"
        ? toast.info
        : toast.warning;


    toastType(
      ({ closeToast }) => (

        <div
          style={{
            width: "100%",
            minWidth: "260px",
          }}
        >

          {/* ==========================================
              TITLE
          ========================================== */}

          <div
            style={{
              fontSize: "15px",
              fontWeight: "700",
              marginBottom: "6px",
              color: "#111827",
            }}
          >
            {title}
          </div>


          {/* ==========================================
              MESSAGE
          ========================================== */}

          <div
            style={{
              fontSize: "13px",
              lineHeight: "1.5",
              color: "#4b5563",
              marginBottom: "14px",
            }}
          >
            {message}
          </div>


          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            {/* CONFIRM */}

            <button
              type="button"
              onClick={() => {

                if (typeof onConfirm === "function") {
                  onConfirm();
                }

                closeToast();

              }}
              style={{
                background:
                  type === "danger"
                    ? "#dc2626"
                    : type === "success"
                    ? "#16a34a"
                    : type === "info"
                    ? "#2563eb"
                    : "#d97706",

                color: "#ffffff",

                border: "none",

                padding: "8px 14px",

                borderRadius: "8px",

                fontSize: "12px",

                fontWeight: "600",

                cursor: "pointer",

                transition: "all 0.2s ease",
              }}
            >
              {confirmText}
            </button>


            {/* CANCEL */}

            <button
              type="button"
              onClick={() => {

                if (typeof onCancel === "function") {
                  onCancel();
                }

                closeToast();

              }}
              style={{
                background: "#e5e7eb",

                color: "#111827",

                border: "none",

                padding: "8px 14px",

                borderRadius: "8px",

                fontSize: "12px",

                fontWeight: "600",

                cursor: "pointer",

                transition: "all 0.2s ease",
              }}
            >
              {cancelText}
            </button>

          </div>

        </div>
      ),

      confirmOptions
    );
  },


  // ==========================================================
  // LOGOUT CONFIRMATION
  // ==========================================================

  confirmLogout: (onConfirm) => {

    notify.confirm({

      title: "Logout",

      message:
        "Are you sure you want to logout?",

      confirmText: "Logout",

      cancelText: "Cancel",

      type: "danger",

      onConfirm,

    });

  },


  // ==========================================================
  // DELETE CONFIRMATION
  // ==========================================================

  confirmDelete: (onConfirm) => {

    notify.confirm({

      title: "Delete",

      message:
        "Are you sure you want to delete this item? This action cannot be undone.",

      confirmText: "Delete",

      cancelText: "Cancel",

      type: "danger",

      onConfirm,

    });

  },


  // ==========================================================
  // SUSPEND CONFIRMATION
  // ==========================================================

  confirmSuspend: (onConfirm) => {

    notify.confirm({

      title: "Suspend Account",

      message:
        "Are you sure you want to suspend this account?",

      confirmText: "Suspend",

      cancelText: "Cancel",

      type: "warning",

      onConfirm,

    });

  },


  // ==========================================================
  // UNSUSPEND CONFIRMATION
  // ==========================================================

  confirmUnsuspend: (onConfirm) => {

    notify.confirm({

      title: "Reactivate Account",

      message:
        "Are you sure you want to reactivate this account?",

      confirmText: "Reactivate",

      cancelText: "Cancel",

      type: "success",

      onConfirm,

    });

  },


  // ==========================================================
  // GENERIC ACTION CONFIRMATION
  // ==========================================================

  confirmAction: ({
    title,
    message,
    confirmText = "Continue",
    cancelText = "Cancel",
    type = "warning",
    onConfirm,
    onCancel,
  }) => {

    notify.confirm({

      title,

      message,

      confirmText,

      cancelText,

      type,

      onConfirm,

      onCancel,

    });

  },

};