import { useEffect, useState } from "react";

import StudentHero from "../components/student/StudentHero";
import StudentStats from "../components/student/StudentStats";
import StudentProfileCard from "../components/student/StudentProfileCard";
import StudentCourseProgress from "../components/student/StudentCourseProgress";
  import StudentAnnouncements from "../components/student/StudentAnnouncements";
  import StudentDeadlines from "../components/student/StudentDeadlines";

import { getStudentProfile } from "../services/studentServices";

import "../styles/StudentDashboard.css";


function StudentDashboard() {

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchStudent = async () => {

      try {

        const res = await getStudentProfile();

        setStudent(res.data);

      } catch(error) {

        console.error(
          "Error loading student:",
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


       <StudentCourseProgress
  student={student}
/>
<StudentAnnouncements />
<StudentDeadlines />


      </div>


    </main>

  );

}


export default StudentDashboard;