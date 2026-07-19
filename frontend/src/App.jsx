import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

// ===========================
// Layouts & Route Protection
// ===========================
import AdminLayout from "./components/AdminLayout";
import StudentLayout from "./components/StudentLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// ===========================
// Public Pages
// ===========================
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Enrollments from "./Pages/Enrollments";

// ===========================
// Admin Pages
// ===========================
import Dashboard from "./Pages/Dashboard";
import Students from "./Pages/Students";
import Courses from "./Pages/Courses";
import Users from "./Pages/Users";
import Settings from "./Pages/Settings";
import AdminAssignments from "./Pages/Assignments";
import AdminAnnouncements from "./Pages/Announcements";

// ===========================
// Student Pages
// ===========================
import StudentDashboard from "./Pages/StudentDashboard";
import BrowseCourses from "./Pages/student/BrowseCourses";
import MyCourses from "./Pages/student/MyCourses";
import StudentAssignments from "./Pages/student/Assignments";
import Announcements from "./Pages/student/Announcements";
import Certification from "./Pages/student/Certification";
import StudentProfile from "./Pages/student/StudentProfile";
import StudentSettings from "./Pages/student/StudentSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================
                PUBLIC ROUTES
        ===================================== */}

        <Route path="/login" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* =====================================
                ADMIN ROUTES
        ===================================== */}

        <Route element={<AdminLayout />}>

          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Students />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Courses />
              </ProtectedRoute>
            }
          />

         <Route
  path="/assignments"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminAssignments />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/announcements"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminAnnouncements />
    </ProtectedRoute>
  }
/>

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
  path="/enrollments"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Enrollments />
    </ProtectedRoute>
  }
/>

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* =====================================
                STUDENT ROUTES
        ===================================== */}

        <Route element={<StudentLayout />}>

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse-courses"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <BrowseCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
  path="/student/assignments"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentAssignments />
    </ProtectedRoute>
  }
/>
          <Route
            path="/announcements"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/certification"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Certification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-settings"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentSettings />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;