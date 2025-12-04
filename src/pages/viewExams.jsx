import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/viewtable.css";

function ViewExams() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Load exams
  const loadExams = async () => {
    const res = await fetch("http://localhost:5000/get-exams");
    const data = await res.json();
    if (data.success) {
      setExams(data.exams);
      setFilteredExams(data.exams);
    }
  };

  // Load department list
  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) {
      setDepartments(data.departments);
    }
  };

  useEffect(() => {
    loadExams();
    loadDepartments();
  }, []);

  // FILTER LOGIC
  const applyFilters = () => {
    let filtered = [...exams];

    // Department filter
    if (departmentFilter !== "") {
      filtered = filtered.filter((ex) =>
        ex.departments_involved
          .split(",")
          .includes(String(departmentFilter))
      );
    }

    // Date filter
    if (dateFilter !== "") {
      filtered = filtered.filter((ex) => ex.exam_date === dateFilter);
    }

    setFilteredExams(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [departmentFilter, dateFilter]);

  return (
    <AdminLayout>
      <h1>View Exams</h1>

      {/* FILTERS */}
      <div className="filter-box">
        <label>Filter by Department</label>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option value={d.department_id} key={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>

        <label>Filter by Date</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>Exam Code</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Time</th>
            <th>Departments</th>
          </tr>
        </thead>

        <tbody>
          {filteredExams.length > 0 ? (
            filteredExams.map((ex) => (
              <tr key={ex.exam_id}>
                <td>{ex.exam_code}</td>
                <td>{ex.subject_name}</td>
                <td>{ex.exam_date}</td>
                <td>{ex.exam_time}</td>
                <td>{ex.departments_involved}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                No Exams Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default ViewExams;
