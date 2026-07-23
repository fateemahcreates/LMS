import { useEffect, useState } from "react";

import StatsCards from "../components/StatsCards";
import RecentStudents from "../components/RecentStudents";
import RecentCourses from "../components/RecentCourses";

import { getStudents } from "../services/studentServices";
import { getCourses } from "../services/courseService";
import { notify } from "../utils/notify";

import "../styles/Dashboard.css";

function Dashboard() {
  // ==========================
  // State
  // ==========================

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // ==========================
  // Fetch Students
  // ==========================

  const fetchStudents = async () => {
  try {
    const res = await getStudents();
    setStudents(res.data);
  } catch (error) {
    console.error(error);
    notify.apiError(error);
  }
};

const fetchCourses = async () => {
  try {
    const res = await getCourses();
    setCourses(res.data);
  } catch (error) {
    console.error(error);
    notify.apiError(error);
  }
};

  // ==========================
  // Load Dashboard Data
  // ==========================

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  return (
    <main className="dashboard">
      {/* ==========================
          Header
      ========================== */}

      <div className="dashboard-header">
        <h2>Dashboard</h2>

        <p>
          Welcome back! Here's an overview of your Learning Management System.
        </p>
      </div>

      {/* ==========================
          Statistics
      ========================== */}

      <StatsCards
        students={students}
        courses={courses}
      />

      {/* ==========================
          Dashboard Widgets
      ========================== */}

      <div className="dashboard-content">

        {/* Recent Students */}

        <div className="table-section">
          <RecentStudents students={students} />
        </div>

        {/* Recent Courses */}

        <div className="form-section">
          <RecentCourses courses={courses} />
        </div>

      </div>
    </main>
  );
}

export default Dashboard;