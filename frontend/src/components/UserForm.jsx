import { useState } from "react";
import { createUser } from "../services/userService";

import "../styles/UserForm.css";

function UserForm({ refreshUsers }) {
  const initialState = {
    name: "",
    email: "",
    password: "",
    role: "student",

    // Student Fields
    studentId: "",
    department: "",
    faculty: "",
    level: "",
    semester: "First Semester",
    phone: "",
  };

  const [formData,setFormData] = useState({

 name:"",
 email:"",
 password:"",
 role:"student",

 studentId:"",
 department:"",
 faculty:"",
 level:"",
 semester:"First Semester",
 phone:""

});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

  const {name,value}=e.target;


  setFormData((prev)=>({

    ...prev,

    [name]:value,


    ...(name === "role" && value !== "student"
      ? {
          studentId:"",
          department:"",
          faculty:"",
          level:"",
          semester:"First Semester",
          phone:""
        }
      : {})

  }));

};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await createUser(formData);

      alert("User created successfully.");

      setFormData(initialState);

      refreshUsers();

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>

      <h2>Account Information</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
      >
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>

      {/* Student Information */}

      {formData.role === "student" && (
        <>
          <hr />

          <h2>Academic Information</h2>

          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="faculty"
            placeholder="Faculty"
            value={formData.faculty}
            onChange={handleChange}
          />

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="">Select Level</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>

          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
          >
            <option>First Semester</option>
            <option>Second Semester</option>
          </select>

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
        </>
      )}

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create User"}
      </button>

    </form>
  );
}

export default UserForm;