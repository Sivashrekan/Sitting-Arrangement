import { useState, useEffect } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../styles/form.css";

function AddStaff() {
  const [staff, setStaff] = useState({
    name: "",
    email: "",
    password: "",
    phone_no: "",
    department_id: "",
    role: "Invigilator",
  });

  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/get-departments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDepartments(data.departments);
      });
  }, []);

  const handleChange = (e) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/staff-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staff),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Staff Added Successfully!");
      setStaff({
        name: "",
        email: "",
        password: "",
        phone_no: "",
        department_id: "",
        role: "Invigilator",
      });
    } else {
      setMessage("Failed to add staff");
    }
  };

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Add Staff</h1>

        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>

          {/* Name */}
          <label>Staff Name</label>
          <input
            type="text"
            name="name"
            value={staff.name}
            onChange={handleChange}
            placeholder="Enter staff name"
            required
            minLength="3"
            maxLength="50"
          />

          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={staff.email}
            onChange={handleChange}
            placeholder="Enter staff email"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />

          {/* Password */}
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={staff.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            minLength="6"
            maxLength="20"
          />

          {/* Phone Number */}
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_no"
            value={staff.phone_no}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
            pattern="^[0-9]{10}$"
            maxLength="10"
          />

          {/* Department */}
          <label>Department</label>
          <select
            name="department_id"
            value={staff.department_id}
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

          {/* Role */}
          <label>Role</label>
          <select name="role" value={staff.role} onChange={handleChange} required>
            <option value="Staff">Staff</option>
            <option value="HOD">HOD</option>
          </select>

          <button type="submit" className="btn">Add Staff</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddStaff;
