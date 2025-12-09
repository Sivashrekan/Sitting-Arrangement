import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/form.css";

function EditHall() {
  const { hall_id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");

  const loadHall = async () => {
    const res = await fetch("http://localhost:5000/get-halls");
    const data = await res.json();

    if (data.success) {
      const h = data.halls.find((x) => x.hall_id == hall_id);
      setHall(h);
    }
  };

  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  useEffect(() => {
    loadHall();
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    setHall({ ...hall, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      hall_name: hall.hall_name,
      table_rows: hall.table_rows,
      table_columns: hall.table_columns,
      department_id: hall.department_id,
    };

    const res = await fetch(`http://localhost:5000/update-hall/${hall_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Hall updated successfully!");
      setTimeout(() => {
        navigate("/view-halls");
      }, 1500);
    }
  };

  if (!hall) return <AdminLayout><h2>Loading...</h2></AdminLayout>;

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Edit Hall</h1>
        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>

          {/* Hall Name */}
          <label>Hall Name</label>
          <input
            type="text"
            name="hall_name"
            value={hall.hall_name}
            onChange={handleChange}
            required
            minLength="2"
            maxLength="20"
            pattern="^[A-Za-z0-9\- ]+$"
            placeholder="Eg: A101, Lab-1"
          />

          {/* Rows */}
          <label>Rows</label>
          <input
            type="number"
            name="table_rows"
            value={hall.table_rows}
            onChange={handleChange}
            required
            min="1"
            max="50"
          />

          {/* Columns */}
          <label>Columns</label>
          <input
            type="number"
            name="table_columns"
            value={hall.table_columns}
            onChange={handleChange}
            required
            min="1"
            max="50"
          />

          {/* Department optional */}
          <label>Department</label>
          <select
            name="department_id"
            value={hall.department_id}
            onChange={handleChange}
          >
            <option value="">General Hall</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          <button className="btn">Update Hall</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditHall;
