import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/viewtable.css";

function ViewHalls() {
  const [halls, setHalls] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const loadHalls = async (dept = "") => {
    let url = "http://localhost:5000/get-halls";
    if (dept) url += `?department_id=${dept}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.success) setHalls(data.halls);
  };

  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  useEffect(() => {
    loadHalls();
    loadDepartments();
  }, []);

  const deleteHall = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hall?")) return;

    const res = await fetch(`http://localhost:5000/delete-hall/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Hall deleted!");
      loadHalls(filter);
    }
  };

  return (
    <AdminLayout>
      <h1>View Halls</h1>

      {/* FILTER */}
      <div className="filter-box">
        <select value={filter} onChange={(e) => { setFilter(e.target.value); loadHalls(e.target.value); }}>
          <option value="">All Halls</option>
          <option value="general">General Halls</option>
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name} Halls
            </option>
          ))}
        </select>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Hall</th>
            <th>Rows</th>
            <th>Columns</th>
            <th>Total Seats</th>
            <th>Department</th>
            <th>View</th>
            <th colSpan={2}>Options</th>
          </tr>
        </thead>

        <tbody>
          {halls.length > 0 ? (
            halls.map((h) => (
              <tr key={h.hall_id}>
                <td>{h.hall_name}</td>
                <td>{h.table_rows}</td>
                <td>{h.table_columns}</td>
                <td>{h.total_seats}</td>
                <td>{h.department_name}</td>

                <td>
                  <button className="view-btn" onClick={() => navigate(`/view-hall/${h.hall_id}`)}>
                    🔍 View
                  </button>
                </td>

                <td>
                  <button className="edit-btn" onClick={() => navigate(`/edit-hall/${h.hall_id}`)}>
                    ✏️ Edit
                  </button>
                </td>

                <td>
                  <button className="delete-btn" onClick={() => deleteHall(h.hall_id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">No halls found</td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default ViewHalls;
