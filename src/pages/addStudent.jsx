import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../styles/form.css";

function AddStudent() {
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");

  const [student, setStudent] = useState({
    name: "",
    roll_no: "",
    date_of_birth: "",
    current_year: "",
    department_id: "",
    email: "",
    phone_no: "",
    gender: "",
  });

  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // --- 17 Years DOB Restriction ---
  const getMaxDOB = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 17);
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/add-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Student added successfully!");
      setStudent({
        name: "",
        roll_no: "",
        date_of_birth: "",
        current_year: "",
        department_id: "",
        email: "",
        phone_no: "",
        gender: "",
      });
    } else {
      setMessage(data.message);
    }
  };

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Add Student</h1>

        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>

          {/* Name */}
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
            minLength="3"
            maxLength="40"
          />

          {/* Roll No */}
          <label>Roll Number</label>
          <input
            type="text"
            name="roll_no"
            value={student.roll_no}
            onChange={handleChange}
            placeholder="Eg: 21CS001"
            required
            pattern="^[0-9]{2}[A-Za-z]{2}[0-9]{3}$"
          />

          {/* DOB */}
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={student.date_of_birth}
            onChange={handleChange}
            required
            max={getMaxDOB()}   // ❗ ensures at least 17 years old
          />

          {/* Year */}
          <label>Current Year</label>
          <select
            name="current_year"
            value={student.current_year}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Year</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
          </select>

          {/* Department */}
          <label>Department</label>
          <select
            name="department_id"
            value={student.department_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Department</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          {/* Email optional */}
          <label>Email (optional)</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />

          {/* Phone optional */}
          <label>Phone No (optional)</label>
          <input
            type="text"
            name="phone_no"
            value={student.phone_no}
            onChange={handleChange}
          pattern="^[0-9]{10}$"
          maxLength="10"
          />

          {/* Gender */}
          <label>Gender</label>
          <select
            name="gender"
            value={student.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <button className="btn">Add Student</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddStudent;
