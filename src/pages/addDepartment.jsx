import { useState } from "react";
import "../CSS/form.css";
import AdminLayout from "../layouts/adminlayout";

function AddDepartment() {
  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      setMessage("Department name is required");
      return;
    }

    const data = {
      dept_name: departmentName,
      dept_code: departmentCode,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/department-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setMessage("Department Added Successfully!");
        setDepartmentName("");
        setDepartmentCode("");
      } else {
        setMessage(result.message || "Something went wrong");
      }
    } catch (err) {
      setMessage("Server Error");
    }
  };

  return (
    <AdminLayout>
    <div className="form-container">
      <h1>Add Department</h1>

      {message && <p className="msg">{message}</p>}

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Department Name</label>
        <input
          type="text"
          placeholder="Enter department name"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />

        <label>Department Code</label>
        <input
          type="text"
          placeholder="Eg: CSE, ECE, MECH"
          value={departmentCode}
          onChange={(e) => setDepartmentCode(e.target.value)}
        />

        <button type="submit" className="btn">Add Department</button>
        
      </form>
    </div>
    </AdminLayout>
  );
}

export default AddDepartment;
