import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout";
import "../styles/form.css";

function EditStaff() {
  const { staff_id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");

  // Load single staff
  const loadStaff = async () => {
    const res = await fetch(`http://localhost:5000/get-staff/${staff_id}`);
    const data = await res.json();

    if (data.success) setStaff(data.staff);
  };

  // Load departments
  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  useEffect(() => {
    loadStaff();
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/update-staff/${staff_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staff),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Staff Updated Successfully!");

      setTimeout(() => {
        navigate("/view-staff");
      }, 1500);
    } else {
      setMessage("Update failed!");
    }
  };

  if (!staff)
    return (
      <AdminLayout>
        <h2>Loading...</h2>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Edit Staff</h1>

        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>
          
          {/* Name */}
          <label>Name</label>
          <input
            name="name"
            value={staff.name}
            onChange={handleChange}
          />

          {/* Email (READ ONLY) */}
          <label>Email</label>
          <input
            name="email"
            value={staff.email}
            readOnly
            style={{ background: "#eee" }}
          />

          {/* Phone */}
          <label>Phone Number</label>
          <input
            name="phone_no"
            value={staff.phone_no}
            onChange={handleChange}
          />

          {/* Department */}
          <label>Department</label>
          <select
            name="department_id"
            value={staff.department_id}
            onChange={handleChange}
          >
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          {/* Role */}
          <label>Role</label>
          <select
            name="role"
            value={staff.role}
            onChange={handleChange}
          >
            <option value="Staff">Staff</option>
            <option value="HOD">HOD</option>
          </select>

          <button className="btn">Update Staff</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditStaff;
