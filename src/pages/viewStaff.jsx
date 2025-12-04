import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout.jsx";
import "../CSS/viewtable.css";
import { useNavigate } from "react-router-dom";

function ViewStaff() {
  const [departments, setDepartments] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const navigate = useNavigate();

  // Load departments
  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  // Load staff
  const loadStaffs = async (dept) => {
    const url = dept
      ? `http://localhost:5000/get-staffs?department_id=${dept}`
      : "http://localhost:5000/get-staffs";

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) setStaffs(data.staffs);
  };

  useEffect(() => {
    loadDepartments();
    loadStaffs("");
  }, []);

  const handleDeptChange = (e) => {
    setSelectedDept(e.target.value);
    loadStaffs(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    const res = await fetch(`http://localhost:5000/delete-staff/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      alert("Staff deleted successfully!");
      loadStaffs(selectedDept);
    } else {
      alert("Delete failed!");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/edit-staff/${id}`);
  };

  return (
    <AdminLayout>
      <div className="table-container">
        <h1>Staff List</h1>

        {/* Department Filter */}
        <div className="filter-box">
          <label>Select Department</label>
          <select value={selectedDept} onChange={handleDeptChange}>
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>
        </div>

        {/* Staff Table */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Role</th>
              <th colSpan={2}>Options</th>
            </tr>
          </thead>

          <tbody>
            {staffs.length > 0 ? (
              staffs.map((s) => (
                <tr key={s.teacher_id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone_no}</td>
                  <td>{s.role}</td>
                  <td>
                    <button
                      className="delete-btn"
                      style={{ background: "#006eff" }}
                      onClick={() => handleUpdate(s.teacher_id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(s.teacher_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No Staff Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default ViewStaff;
