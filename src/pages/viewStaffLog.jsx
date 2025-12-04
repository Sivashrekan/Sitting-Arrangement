import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/viewtable.css";

function ViewStaffLog() {
  const [logs, setLogs] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [filterDept, setFilterDept] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadDepartments = async () => {
    const res = await fetch("http://localhost:5000/get-departments");
    const data = await res.json();
    if (data.success) setDepartments(data.departments);
  };

  const loadLogs = async () => {
    let url = "http://localhost:5000/get-staff-logs?";
    const params = [];

    if (filterDept) params.push(`department_id=${filterDept}`);
    if (filterRole) params.push(`role=${filterRole}`);
    if (fromDate) params.push(`from=${fromDate}`);
    if (toDate) params.push(`to=${toDate}`);

    url += params.join("&");

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) setLogs(data.logs);
  };

  useEffect(() => {
    loadDepartments();
    loadLogs();
  }, []);

  const applyFilters = () => {
    loadLogs();
  };

  return (
    <AdminLayout>
      <div className="table-container">
        <h1>Staff Login Logs</h1>

        {/* Filter Box */}
        <div className="filter-box">
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="HOD">HOD</option>
            <option value="Staff">Staff</option>
            <option value="Invigilator">Invigilator</option>
          </select>

          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

          <button className="btn" onClick={applyFilters}>Apply</button>
        </div>

        {/* Logs Table */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Login Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.log_id}>
                  <td>{log.name || "Unknown"}</td>
                  <td>{log.email || "—"}</td>
                  <td>{log.role}</td>
                  <td>{log.department_name || "—"}</td>
                  <td>{new Date(log.login_time).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No Staff Logs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default ViewStaffLog;
