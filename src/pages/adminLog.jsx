import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/viewtable.css";

function ViewAdminLog() {
  const [logs, setLogs] = useState([]);

  // Load admin logs
  const loadLogs = async () => {
    const res = await fetch("http://localhost:5000/get-admin-log");
    const data = await res.json();

    if (data.success) setLogs(data.logs);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <AdminLayout>
      <h1>Admin Login Log</h1>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Log ID</th>
            <th>Admin Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Login Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.length > 0 ? (
            logs.map((l) => (
              <tr key={l.log_id}>
                <td>{l.log_id}</td>
                <td>{l.username}</td>
                <td>{l.email}</td>
                <td>{l.role}</td>
                <td>{new Date(l.login_time).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No Logs Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default ViewAdminLog;
