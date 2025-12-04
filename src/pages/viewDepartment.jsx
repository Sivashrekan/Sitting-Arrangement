import { useEffect, useState } from "react";
import "../CSS/viewtable.css";
import AdminLayout from "../layouts/adminlayout.jsx";

function ViewDepartments() {
  const [departments, setDepartments] = useState([]);

  const loadDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/get-departments");
      const data = await res.json();

      if (data.success && Array.isArray(data.departments)) {
        setDepartments(data.departments);
      } else {
        setDepartments([]);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // 🔥 DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/delete-department/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Department deleted successfully!");
        loadDepartments(); // Refresh list
      } else {
        alert("Failed to delete department!");
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <AdminLayout>
      <div className="table-container">
        <h1>Department List</h1>

        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department Name</th>
              <th>Department Code</th>
              <th>Options</th> {/* 🔥 New Column */}
            </tr>
          </thead>

          <tbody>
            {departments.length > 0 ? (
              departments.map((d, index) => (
                <tr key={index}>
                  <td>{d.department_id}</td>
                  <td>{d.department_name}</td>
                  <td>{d.department_code || "-"}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(d.department_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No Departments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default ViewDepartments;
