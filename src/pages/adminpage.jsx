import React, { useEffect, useState } from "react";
import "../CSS/adminpage.css";
import AdminLayout from "../layouts/adminlayout";

function AdminPage() {

  const [stats, setStats] = useState({
    students: 0,
    halls: 0,
    staff: 0,
    departments: 0,
    seating: 0
  });

  const loadStats = async () => {
    const res = await fetch("http://localhost:5000/admin-stats");
    const data = await res.json();

    if (data.success) {
      setStats({
        students: data.students,
        halls: data.halls,
        staff: data.staff,
        departments: data.departments,
        seating: data.seating
      });
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <main>

        {/* HEADER */}
        <header className="admin-header">
          <h1>Welcome, Admin</h1>
          <p>Manage everything from your dashboard.</p>
        </header>

        {/* STAT CARDS */}
        <div className="stats">

          <div className="stat-card">
            <span className="icon">🎓</span>
            <h3>Total Students</h3>
            <p>{stats.students}</p>
          </div>

          <div className="stat-card">
            <span className="icon">🏫</span>
            <h3>Halls Available</h3>
            <p>{stats.halls}</p>
          </div>

          <div className="stat-card">
            <span className="icon">🪑</span>
            <h3>Seating Plans</h3>
            <p>{stats.seating}</p>
          </div>

          <div className="stat-card">
            <span className="icon">👨‍🏫</span>
            <h3>Total Staff</h3>
            <p>{stats.staff}</p>
          </div>

          <div className="stat-card">
            <span className="icon">🏢</span>
            <h3>Total Departments</h3>
            <p>{stats.departments}</p>
          </div>

        </div>

      </main>
    </AdminLayout>
  );
}

export default AdminPage;
