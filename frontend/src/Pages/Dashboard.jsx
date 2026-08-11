import { useEffect, useState } from "react";

import DashboardHero from "../components/DashboardHero";
import StatsCards from "../components/StatsCards";
import RecentStudents from "../components/RecentStudents";
import RecentCourses from "../components/RecentCourses";

import { getStudents } from "../services/studentServices";
import { getCourses } from "../services/courseService";

import { notify } from "../utils/notify";

import "../styles/Dashboard.css";

function Dashboard() {

  // ==========================================
  // USER
  // ==========================================

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const role =
    (user.role || "").toLowerCase();

  // ==========================================
  // STATE
  // ==========================================

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // ==========================================
  // FETCH STUDENTS (ADMIN ONLY)
  // ==========================================

  const fetchStudents = async () => {

    if (role !== "admin") return;

    try {

      const res = await getStudents();

      setStudents(res.data);

    } catch (error) {

      console.error(error);

      notify.apiError(error);

    }

  };

  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = async () => {

    try {

      const res = await getCourses();

      setCourses(res.data);

    } catch (error) {

      console.error(error);

      notify.apiError(error);

    }

  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {

    fetchStudents();

    fetchCourses();

  }, []);

  return (

    <main className="dashboard">

      {/* HERO */}

      <DashboardHero

        students={students}

        courses={courses}

        role={role}

      />

      {/* STATS */}

      <StatsCards

        students={students}

        courses={courses}

        role={role}

      />

      {/* CONTENT */}

      <div className="dashboard-content">

        {

          role === "admin"

          ?

          (

            <>

              <div className="table-section">

                <RecentStudents

                  students={students}

                />

              </div>

              <div className="form-section">

                <RecentCourses

                  courses={courses}

                />

              </div>

            </>

          )

          :

          (

            <div
              className="table-section"
              style={{width:"100%"}}
            >

              <RecentCourses

                courses={courses}

              />

            </div>

          )

        }

      </div>

    </main>

  );

}

export default Dashboard;