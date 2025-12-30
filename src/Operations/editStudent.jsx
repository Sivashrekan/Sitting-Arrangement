import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout";
import "../styles/form.css";

function EditStudent() {
  const { student_id } = useParams();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [student, setStudent] = useState(null);

  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  const loadStudent = async () => {
    const res = await fetch("http://localhost:5000/get-students");
    const data = await res.json();
    if (data.success) {
      const found = data.students.find((s) => s.student_id == student_id);
      setStudent(found);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadStudent();
  }, []);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/update-student/${student_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Student updated successfully!");
      setTimeout(() => navigate("/view-students"), 1500);
    } else {
      setMessage("Failed to update student");
    }
  };

  if (!student)
    return (
      <AdminLayout>
        <h2>Loading...</h2>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Edit Student</h1>

        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>

          {/* Name → Editable */}
          <label>Name</label>
          <input
            name="name"
            value={student.name}
            onChange={handleChange}
          />

          {/* Roll Number → NOT Editable */}
          <label>Roll Number</label>
          <input
            name="roll_no"
            value={student.roll_no}
            readOnly
            style={{ background: "#eee" }}
          />

          {/* DOB → Editable */}
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={student.date_of_birth}
            onChange={handleChange}
          />

          {/* Year → Editable */}
          <label>Current Year</label>
          <select
            name="current_year"
            value={student.current_year}
            onChange={handleChange}
          >
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
          </select>

          {/* Department → Editable */}
          <label>Department</label>
          <select
              name="department_id"
              value={student.department_id}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>


          {/* Email → NOT Editable */}
          <label>Email</label>
          <input
            name="email"
            value={student.email || ""}
            readOnly
            style={{ background: "#eee" }}
          />

          {/* Phone → Editable */}
          <label>Phone Number</label>
          <input
            name="phone_no"
            value={student.phone_no || ""}
            onChange={handleChange}
          />

          {/* Gender → NOT Editable */}
          <label>Gender</label>
          <select
            name="gender"
            value={student.gender}
            disabled
            style={{ background: "#eee", color: "#555" }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <button className="btn">Update Student</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditStudent;
