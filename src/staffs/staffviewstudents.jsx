import { useEffect, useState } from "react";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/viewtable.css";

function StaffViewStudents() {
  const deptId = localStorage.getItem("staff_department");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/staff/students/${deptId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStudents(data.students);
      });
  }, [deptId]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <StaffLayout>
      <div className="table-container">
        <h1>Students (My Department)</h1>

        <input
          type="text"
          placeholder="Search by name or roll number..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Year</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Gender</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s, i) => (
                <tr key={s.student_id}>
                  <td>{i + 1}</td>
                  <td>{s.roll_no}</td>
                  <td>{s.name}</td>
                  <td>{s.current_year}</td>
                  <td>{s.email || "—"}</td>
                  <td>{s.phone_no || "—"}</td>
                  <td>{s.gender || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}

export default StaffViewStudents;
