import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  // Get authentication data
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  // User is not logged in
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Ensure user has a role
  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role comparison (case-insensitive)
  const userRole = user.role.toLowerCase();

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    role.toLowerCase()
  );

  // User does not have permission
  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;