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

// Instructor Layout
import InstructorLayout from "./components/instructor/InstructorLayout";

// ===========================
// Public Pages
// ===========================
import Login from "./Pages/Login";

import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

// ===========================
// Admin Pages
// ===========================
import Dashboard from "./Pages/Dashboard";
import Courses from "./Pages/Courses";
import AdminAssignments from "./Pages/Assignments";
import AdminAnnouncements from "./Pages/Announcements";
import Students from "./Pages/Students";
import Users from "./Pages/Users";
import Settings from "./Pages/settings/Settings";
import Enrollments from "./Pages/Enrollments";
import AdminCertificates from "./Pages/AdminCertificates";

// ===========================
// Instructor Pages
// ===========================
import InstructorCourses from "./Pages/instructor/InstructorCourses";
import InstructorCourseDetails from "./Pages/instructor/InstructorCourseDetails";
import InstructorDashboard from "./Pages/instructor/InstructorDashboard";
import CreateCourse from "./Pages/instructor/CreateCourse";
import InstructorStudents from "./Pages/instructor/InstructorStudents"; 
import InstructorAssignments from "./Pages/instructor/InstructorAssignments"; 
import InstructorAnnouncements from "./Pages/instructor/InstructorAnnouncements";
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


        {/* ===========================
            PUBLIC ROUTES
        =========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />


        {/* ===========================
            ADMIN PORTAL
        =========================== */}

        <Route
          element={<AdminLayout />}
        >

          <Route
            path="/"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/courses"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <Courses />
              </ProtectedRoute>
            }
          />


          <Route
            path="/assignments"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminAssignments />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminAnnouncements />
              </ProtectedRoute>
            }
          />


          <Route
            path="/students"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <Students />
              </ProtectedRoute>
            }
          />


          <Route
            path="/users"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <Users />
              </ProtectedRoute>
            }
          />


          <Route
            path="/enrollments"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <Enrollments />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminCertificates />
              </ProtectedRoute>
            }
          />


          <Route
            path="/settings"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <Settings />
              </ProtectedRoute>
            }
          />

        </Route>



        {/* ===========================
            INSTRUCTOR PORTAL
        =========================== */}

        <Route
          path="/instructor"
          element={
            <ProtectedRoute
              allowedRoles={["instructor"]}
            >
              <InstructorLayout />
            </ProtectedRoute>
          }
        >

          <Route
  index
  element={<InstructorDashboard />}
/>

          <Route
            path="courses"
            element={
              <InstructorCourses />
            }
          />
          

          <Route
  path="/instructor/create-course"
  element={<CreateCourse />}
/>

          <Route
            path="course/:courseId"
            element={
              <InstructorCourseDetails />
            }
          />
         
         <Route
    path="students"
    element={<InstructorStudents />}
  />

<Route
  path="assignments"
  element={<InstructorAssignments />}
/>

<Route
  path="announcements"
  element={
    <InstructorAnnouncements />
  }
/>

<Route
  path="settings"
  element={<Settings />}
/>
        </Route>

        



        {/* ===========================
            STUDENT PORTAL
        =========================== */}

        <Route
          element={<StudentLayout />}
        >

          <Route
            path="/student"
            element={
              <ProtectedRoute
                allowedRoles={["student"]}
              >
                <StudentDashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/browse-courses"
            element={
              <ProtectedRoute
                allowedRoles={["student"]}
              >
                <BrowseCourses />
              </ProtectedRoute>
            }
          />


          <Route
            path="/my-courses"
            element={
              <ProtectedRoute
                allowedRoles={["student"]}
              >
                <MyCourses />
              </ProtectedRoute>
            }
          />


          <Route
            path="/student/assignments"
            element={
              <ProtectedRoute
                allowedRoles={["student"]}
              >
                <StudentAssignments />
              </ProtectedRoute>
            }
          />


          <Route
            path="/announcements"
            element={
              <ProtectedRoute
                allowedRoles={["student"]}
              >
                <Announcements />
              </ProtectedRoute>
            }
          />


          <Route
            path="/certification"
            element={
              <ProtectedRoute
                allowedRoles={["student"]}
              >
                <Certification />
              </ProtectedRoute>
            }
          />


          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["student"]}
              >
                <StudentProfile />
              </ProtectedRoute>
            }
          />


          <Route
  path="/student-settings"
  element={
    <ProtectedRoute
      allowedRoles={["student"]}
    >
      <Settings />
    </ProtectedRoute>
  }
/>


        </Route>


      </Routes>

    </BrowserRouter>
  );
}


export default App;