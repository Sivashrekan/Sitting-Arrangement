import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../styles/form.css";

function AddHall() {
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");

  const [hall, setHall] = useState({
    hall_name: "",
    table_rows: "",
    table_columns: "",
    department_id: "",
  });

  const handleChange = (e) => {
    setHall({ ...hall, [e.target.name]: e.target.value });
  };

  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/add-hall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hall),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Hall Added Successfully!");
      setHall({
        hall_name: "",
        table_rows: "",
        table_columns: "",
        department_id: "",
      });
    } else {
      setMessage("Error adding hall");
    }
  };

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Add Exam Hall</h1>

        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>

          {/* Hall Name */}
          <label>Hall Name</label>
          <input
            type="text"
            name="hall_name"
            value={hall.hall_name}
            onChange={handleChange}
            placeholder="Eg: A101, Lab-1"
            required
            minLength="2"
            maxLength="20"
            pattern="^[A-Za-z0-9\- ]+$"
            title="Only letters, numbers, spaces, and hyphens allowed"
          />

          {/* Rows */}
          <label>Number of Rows (Benches)</label>
          <input
            type="number"
            name="table_rows"
            value={hall.table_rows}
            onChange={handleChange}
            placeholder="Eg: 5"
            required
            min="1"
            max="50"
          />

          {/* Columns */}
          <label>Number of Columns (Benches)</label>
          <input
            type="number"
            name="table_columns"
            value={hall.table_columns}
            onChange={handleChange}
            placeholder="Eg: 6"
            required
            min="1"
            max="50"
          />

          {/* Department Optional */}
          <label>Department (Optional)</label>
          <select
            name="department_id"
            value={hall.department_id}
            onChange={handleChange}
          >
            <option value="">General Hall (No Department)</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          <button type="submit" className="btn">Add Hall</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddHall;
