import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // User is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // User information is missing
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User does not have permission
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;