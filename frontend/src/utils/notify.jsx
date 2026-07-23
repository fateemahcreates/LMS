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
  success: (message) => toast.success(message, options),

  error: (message) => toast.error(message, options),

  warning: (message) => toast.warning(message, options),

  info: (message) => toast.info(message, options),

  apiError: (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong.";

    toast.error(message, options);
  },

  confirmLogout: (onConfirm) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>
            Are you sure you want to logout?
          </p>

          <div style={{ marginTop: "10px" }}>

            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              style={{
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>


            <button
              onClick={closeToast}
              style={{
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
      }
    );
  },
};