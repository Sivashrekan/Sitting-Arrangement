import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/viewtable.css";

function ViewStudentLog() {
  const [departments, setDepartments] = useState([]);
  const [logs, setLogs] = useState([]);

  const [deptFilter, setDeptFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Load departments
  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  // Load student logs
  const loadLogs = async (dept = "", year = "") => {
    let url = "http://localhost:5000/get-student-log";

    const params = [];
    if (dept) params.push(`department_id=${dept}`);
    if (year) params.push(`year=${year}`);

    if (params.length > 0) url += "?" + params.join("&");

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) setLogs(data.logs);
  };

  useEffect(() => {
    loadDepartments();
    loadLogs();
  }, []);

  const applyFilters = () => {
    loadLogs(deptFilter, yearFilter);
  };

  return (
    <AdminLayout>
      <h1>Student Login Log</h1>

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

      <table className="custom-table">
        <thead>
          <tr>
            <th>Log ID</th>
            <th>Roll No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Year</th>
            <th>Login Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.length > 0 ? (
            logs.map((l) => (
              <tr key={l.log_id}>
                <td>{l.log_id}</td>
                <td>{l.roll_no}</td>
                <td>{l.name}</td>
                <td>{l.department_name}</td>
                <td>{l.current_year}</td>
                <td>{new Date(l.login_time).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No Log Entries Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default ViewStudentLog;
