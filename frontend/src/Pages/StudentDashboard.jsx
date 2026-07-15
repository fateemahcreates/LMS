import { useEffect, useState } from "react";

import StudentHero from "../components/student/StudentHero";
import StudentStats from "../components/student/StudentStats";
import StudentProfileCard from "../components/student/StudentProfileCard";
import StudentCourses from "../components/student/StudentCourses";

import { getStudentProfile } from "../services/studentServices";

import "../styles/StudentDashboard.css";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudentProfile();

        // Your controller may return either:
        // { student: {...} }
        // or simply {...}
        setStudent(res.data.student || res.data);
      } catch (error) {
        console.error("Error loading student profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) {
    return (
      <main className="student-dashboard">
        <h2>Loading dashboard...</h2>
      </main>
    );
  }

  return (
    <main className="student-dashboard">
      <StudentHero student={student} />

      <StudentStats student={student} />

      <div className="student-dashboard-grid">
        <StudentProfileCard student={student} />

        <StudentCourses student={student} />
      </div>
    </main>
  );
}

export default StudentDashboard;