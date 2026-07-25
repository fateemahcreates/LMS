import { useEffect, useState } from "react";

import StudentHero from "../components/student/StudentHero";
import StudentStats from "../components/student/StudentStats";
import StudentProfileCard from "../components/student/StudentProfileCard";
import StudentProgressCard from "../components/student/StudentProgressCard";
  import StudentAnnouncements from "../components/student/StudentAnnouncements";
  import StudentDeadlines from "../components/student/StudentDeadlines";

import { getStudentProfile } from "../services/studentServices";
import { getMyCourses } from "../services/enrollmentService";

import "../styles/StudentDashboard.css";


function StudentDashboard() {

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEnrollment, setCurrentEnrollment] = useState(null);

  useEffect(() => {

    const fetchStudent = async () => {
  try {

    const [studentRes, enrollmentRes] =
      await Promise.all([
        getStudentProfile(),
        getMyCourses(),
      ]);

    setStudent(studentRes.data);

    const activeCourse =
      enrollmentRes.data.find(
        (enrollment) =>
          enrollment.status !== "Completed"
      ) || enrollmentRes.data[0];

    setCurrentEnrollment(activeCourse);

  } catch (error) {

    console.error(
      "Error loading student dashboard:",
      error
    );

  } finally {

    setLoading(false);

  }
};


    fetchStudent();

  }, []);



  if(loading){

    return (
      <main className="student-dashboard">
        <h2>
          Loading dashboard...
        </h2>
      </main>
    );

  }



  return (

    <main className="student-dashboard">


      <StudentHero
        student={student}
      />


      <StudentStats
        student={student}
      />


      <div className="student-dashboard-grid">


        <StudentProfileCard
          student={student}
        />


       <StudentProgressCard
  enrollment={currentEnrollment}
/>
<StudentAnnouncements />
<StudentDeadlines />


      </div>


    </main>

  );

}


export default StudentDashboard;