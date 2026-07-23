import { useState, useEffect } from "react";

import StudentForm from "../components/StudentsForm";
import StudentTable from "../components/StudentTable";
import { notify } from "../utils/notify";

import {
  getStudents,
  updateStudent,
  deleteStudent,
} from "../services/studentServices";

import "../styles/Students.css";


function Students() {


  const [students, setStudents] = useState([]);

  const [editingStudent, setEditingStudent] =
    useState(null);


  const [formData, setFormData] = useState({

    studentId: "",
    department: "",
    faculty: "",
    level: "",
    semester: "",
    phone: "",

  });



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



  useEffect(()=>{

    fetchStudents();

  },[]);




  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (e)=>{

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };




  // ==========================
  // Update Student
  // ==========================

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.studentId ||
    !formData.department ||
    !formData.level ||
    !formData.semester
  ) {
    notify.warning("Please fill in all required fields.");
    return;
  }

  try {
    await updateStudent(
      editingStudent._id,
      formData
    );

    notify.success("Student updated successfully.");

    setEditingStudent(null);

    setFormData({
      studentId: "",
      department: "",
      faculty: "",
      level: "",
      semester: "",
      phone: "",
    });

    fetchStudents();

  } catch (error) {
    console.error(error);
    notify.apiError(error);
  }
};

  // ==========================
  // Delete Student
  // ==========================

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Delete this student?"
  );

  if (!confirmDelete) {
    notify.info("Deletion cancelled.");
    return;
  }

  try {
    await deleteStudent(id);

    notify.success("Student deleted successfully.");

    fetchStudents();

  } catch (error) {
    console.error(error);
    notify.apiError(error);
  }
};





  // ==========================
  // Edit Student
  // ==========================

  const handleEdit=(student)=>{

   notify.info("Editing student profile.");
    setEditingStudent(student);



    setFormData({

      studentId:
        student.studentId || "",


      department:
        student.department || "",


      faculty:
        student.faculty || "",


      level:
        student.level || "",


      semester:
        student.semester || "",


      phone:
        student.phone || "",


    });


  };





  return (

    <main className="dashboard">


      <div className="dashboard-header">

        <h2>
          Student Management
        </h2>


        <p>
          Manage enrolled students and update academic records.
        </p>

      </div>




      <div className="dashboard-content">


        <div className="form-section">


          {
            editingStudent ? (

              <StudentForm

                formData={formData}

                handleChange={handleChange}

                handleSubmit={handleSubmit}

                editingStudent={editingStudent}

              />


            ) : (

              <div className="student-info-card">

                <h3>
                  Student Registration
                </h3>


                <p>
                  New students are created from the Users section.
                </p>


              </div>

            )
          }



        </div>





        <div className="table-section">


          <StudentTable

            students={students}

            handleDelete={handleDelete}

            handleEdit={handleEdit}

          />


        </div>



      </div>


    </main>

  );

}


export default Students;