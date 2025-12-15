import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout"; 
import "../CSS/viewtable.css";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [deptFilter, setDeptFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10; // number of rows per page

  const navigate = useNavigate();

  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    const res = await fetch(`http://localhost:5000/delete-student/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) {
      alert("Student deleted!");
      loadStudents(deptFilter, yearFilter);
    }
  };

  const loadStudents = async (dept = "", year = "") => {
    let url = "http://localhost:5000/get-students";

    const params = [];
    if (dept) params.push(`department_id=${dept}`);
    if (year) params.push(`year=${year}`);

    if (params.length > 0) url += "?" + params.join("&");

    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      setStudents(data.students);
      setCurrentPage(1); // reset pagination on filter change
    }
  };

  useEffect(() => {
    loadDepartments();
    loadStudents();
  }, []);

  const applyFilters = () => {
    loadStudents(deptFilter, yearFilter);
  };

  // ------------------------------------
  // PAGINATION LOGIC 
  // ------------------------------------
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const paginatedStudents = students.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  // ------------------------------------

  return (
    <AdminLayout>
      <h1>View Students</h1>

      {/* FILTERS */}
      <div className="filter-box">
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>

        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="">All Years</option>
          <option value="I">I Year</option>
          <option value="II">II Year</option>
          <option value="III">III Year</option>
          <option value="IV">IV Year</option>
        </select>

        <button className="btn" onClick={applyFilters}>Apply</button>
      </div>

      {/* TABLE */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Year</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone No</th>
            <th colSpan={2}>Options</th>
          </tr>
        </thead>

        <tbody>
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((s) => (
              <tr key={s.student_id}>
                <td>{s.roll_no}</td>
                <td>{s.name}</td>
                <td>{s.department_name}</td>
                <td>{s.current_year}</td>
                <td>{s.gender}</td>
                <td>{s.email || "—"}</td>
                <td>{s.phone_no || "—"}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/edit-student/${s.student_id}`)}
                  >
                    ✏️ Edit
                  </button>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteStudent(s.student_id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-data">No Students Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION BUTTONS */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={prevPage}>
          ◀ Prev
        </button>

        <span>Page {currentPage} / {totalPages}</span>

        <button disabled={currentPage === totalPages} onClick={nextPage}>
          Next ▶
        </button>
      </div>
    </AdminLayout>
  );
}

export default ViewStudents;