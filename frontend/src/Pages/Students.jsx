import { useEffect, useState } from "react";

import StudentTable from "../components/StudentTable";

import AdminStudentDrawer from "../components/AdminStudentDrawer";
import StudentEditDrawer from "../components/StudentEditDrawer";

import {
  FaUsers,
  FaUserGraduate,
  FaCheckCircle,
  FaBookOpen,
  FaChartLine,
} from "react-icons/fa";

import { notify } from "../utils/notify";

import {
  getStudents,
  updateStudent,
  deleteStudent,
} from "../services/studentServices";

import "../styles/Students.css";


function Students() {


  // ==========================================
  // INITIAL FORM STATE
  // ==========================================

  const initialState = {

    studentId:"",
    program:"",
    faculty:"",
    semester:"",
    phone:"",

  };


  const [
    students,
    setStudents
  ] = useState([]);


  const [
    editingStudent,
    setEditingStudent
  ] = useState(null);


  const [selectedStudent, setSelectedStudent] = useState(null);

const [viewDrawerOpen, setViewDrawerOpen] =
  useState(false);

const [editDrawerOpen, setEditDrawerOpen] =
  useState(false);

  const [
    formData,
    setFormData
  ] = useState(initialState);



  // ==========================================
  // FETCH STUDENTS
  // ==========================================

  const fetchStudents = async()=>{

    try{

      const res = await getStudents();

      setStudents(res.data);

    }
    catch(error){

      console.error(error);

      notify.apiError(error);

    }

  };



  useEffect(()=>{

    fetchStudents();

  },[]);



  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value,

    });

  };



  // ==========================================
  // EDIT STUDENT
  // ==========================================

 const handleEdit = (student) => {

  setEditingStudent(student);

  setFormData({

    studentId: student.studentId || "",

    program: student.program || "",

    semester: student.semester || "",

    phone: student.phone || "",

  });

  setEditDrawerOpen(true);

};


const handleView = (student) => {

  setSelectedStudent(student);

  setViewDrawerOpen(true);

};


  // ==========================================
  // UPDATE STUDENT
  // ==========================================

  const handleSubmit = async(e)=>{

    e.preventDefault();


    if(
      !formData.studentId ||
      !formData.program ||
      !formData.semester
    ){

      notify.warning(
        "Please fill in all required fields."
      );

      return;

    }


    try{


      await updateStudent(
        editingStudent._id,
        formData
      );


      notify.success(
        "Student updated successfully."
      );


      await fetchStudents();


      setEditDrawerOpen(false);

      setEditingStudent(null);


      setFormData(initialState);


    }
    catch(error){

      console.error(error);

      notify.apiError(error);

    }

  };



  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const handleDelete = async(id)=>{


    if(
      !window.confirm(
        "Delete this student?"
      )
    ){

      notify.info(
        "Deletion cancelled."
      );

      return;

    }



    try{


      await deleteStudent(id);


      notify.success(
        "Student deleted successfully."
      );


      fetchStudents();


    }
    catch(error){

      console.error(error);

      notify.apiError(error);

    }


  };



  // ==========================================
  // STATS
  // ==========================================

  const totalStudents =
    students.length;


  const activeStudents =
    students.filter(
      student =>
      student.isActive !== false
    ).length;



  const totalPrograms =
    [
      ...new Set(
        students
        .map(
          student=>student.program
        )
        .filter(Boolean)
      )
    ].length;



  const averageProgress =
    students.length > 0
    ?
    Math.round(
      students.reduce(
        (sum,student)=>
        sum + (student.progress || 0),
        0
      )
      /
      students.length
    )
    :
    0;



  return (


    <div className="gmt-admin-students-page">


      {/* ======================================
          HEADER
      ====================================== */}


      <div className="gmt-admin-students-header">


        <div className="gmt-admin-students-heading">


          <span className="gmt-admin-students-tag">

            STUDENT MANAGEMENT

          </span>


          <h1>

            Student Management

          </h1>


          <p>

            Manage GMT Academy learners,
            monitor enrolments and update
            student information.

          </p>


        </div>



        <button
          className="gmt-admin-student-btn"
        >

          <FaUsers />

          Students

        </button>



      </div>




      {/* ======================================
          STATS
      ====================================== */}



      <div className="gmt-admin-student-stats">



        <div className="gmt-admin-student-stat-card">


          

          <div>

            <h2>
              {totalStudents}
            </h2>

            <span>
              Total Students
            </span>

          </div>


        </div>




        <div className="gmt-admin-student-stat-card">


          

          <div>

            <h2>
              {activeStudents}
            </h2>


            <span>
              Active Students
            </span>


          </div>


        </div>




        <div className="gmt-admin-student-stat-card">


          


          <div>

            <h2>
              {totalPrograms}
            </h2>


            <span>
              Programs
            </span>


          </div>


        </div>





        <div className="gmt-admin-student-stat-card">


          <FaChartLine
            className="gmt-admin-student-stat-icon"
          />


          <div>

            <h2>
              {averageProgress}%
            </h2>


            <span>
              Learning Progress
            </span>


          </div>


        </div>



      </div>





      {/* ======================================
          TABLE
      ====================================== */}



      <div className="gmt-admin-student-table-wrapper">


        <StudentTable
  students={students}
  handleView={handleView}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
/>

      </div>






      {/* ======================================
          DRAWER
      ====================================== */}



      {(viewDrawerOpen || editDrawerOpen) && (

    <div
        className="drawer-backdrop"
        onClick={() => {

            setViewDrawerOpen(false);

            setEditDrawerOpen(false);

        }}
    />

)}




      <AdminStudentDrawer

    open={viewDrawerOpen}

    onClose={() => setViewDrawerOpen(false)}

    student={selectedStudent}

/>

<StudentEditDrawer

    open={editDrawerOpen}

    onClose={() => setEditDrawerOpen(false)}

    formData={formData}

    handleChange={handleChange}

    handleSubmit={handleSubmit}

    editingStudent={editingStudent}

/>


    </div>


  );

}


export default Students;