import "../styles/StudentForm.css";
import { notify } from "../utils/notify";

import {
  FaIdCard,
  FaBuilding,
  FaUniversity,
  FaGraduationCap,
  FaPhone,
  FaEdit,
} from "react-icons/fa";


function StudentForm({
  formData,
  handleChange,
  handleSubmit,
  editingStudent,
}) {


  return (

    <form
      className="student-form"
      onSubmit={handleSubmit}
    >


      {/* Header */}

      <div className="form-header">

        <h2>
          Update Student Profile
        </h2>


        <p>
          Manage student's academic information.
        </p>

      </div>





      {/* Student ID */}

      <div className="input-group">

        <label>
          Student ID
        </label>


        <div className="input-wrapper">

          <FaIdCard className="input-icon"/>


          <input

            type="text"

            name="studentId"

            placeholder="LMS2026001"

            value={formData.studentId}

            onChange={handleChange}

            required

          />


        </div>


      </div>






      {/* Department */}

      <div className="input-group">

        <label>
          Department
        </label>


        <div className="input-wrapper">

          <FaBuilding className="input-icon"/>


          <input

            type="text"

            name="department"

            placeholder="Computer Science"

            value={formData.department}

            onChange={handleChange}

            required

          />


        </div>


      </div>







      {/* Faculty */}

      <div className="input-group">

        <label>
          Faculty
        </label>


        <div className="input-wrapper">

          <FaUniversity className="input-icon"/>


          <input

            type="text"

            name="faculty"

            placeholder="Faculty of Science"

            value={formData.faculty}

            onChange={handleChange}

          />


        </div>


      </div>








      {/* Level */}

      <div className="input-group">

        <label>
          Level
        </label>


        <div className="input-wrapper">

          <FaGraduationCap className="input-icon"/>


          <select

            name="level"

            value={formData.level}

            onChange={handleChange}

            required

          >

            <option value="">
              Select Level
            </option>


            <option value="100">
              100 Level
            </option>


            <option value="200">
              200 Level
            </option>


            <option value="300">
              300 Level
            </option>


            <option value="400">
              400 Level
            </option>


            <option value="500">
              500 Level
            </option>


          </select>


        </div>


      </div>









      {/* Semester */}

      <div className="input-group">

        <label>
          Semester
        </label>


        <div className="input-wrapper">

          <FaGraduationCap className="input-icon"/>


          <select

            name="semester"

            value={formData.semester}

            onChange={handleChange}

            required

          >

            <option value="">
              Select Semester
            </option>


            <option value="First Semester">
              First Semester
            </option>


            <option value="Second Semester">
              Second Semester
            </option>


          </select>


        </div>


      </div>









      {/* Phone */}

      <div className="input-group">

        <label>
          Phone Number
        </label>


        <div className="input-wrapper">

          <FaPhone className="input-icon"/>


          <input

            type="text"

            name="phone"

            placeholder="+234..."

            value={formData.phone}

            onChange={handleChange}

          />


        </div>


      </div>








      {/* Button */}

      <button

        type="submit"

        className="submit-btn"

        disabled={!editingStudent}

      >

        <FaEdit />


        <span>
          Update Student
        </span>


      </button>



    </form>

  );

}


export default StudentForm;