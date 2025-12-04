import "../CSS/adminpage.css";
import { useNavigate } from "react-router-dom";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const isSuperAdmin = localStorage.getItem("role") === "Super Admin";

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <aside className="side scroll-sidebar">
        <h2 className="side-title">Admin Panel</h2>

        <ul className="side-menu">
          {/* DASHBOARD */}
          <li onClick={() => navigate("/admin")}>🏠 Dashboard</li>

          {/* ADD SECTION */}
          <li onClick={() => navigate("/add-dept")}>🏢 Add Department</li>
          <li onClick={() => navigate("/add-staff")}>👨‍🏫 Add Staff</li>
          <li onClick={() => navigate("/add-exam")}>📝 Add Exam</li>
          <li onClick={() => navigate("/add-students")}>➕ Add Students</li>
          <li onClick={() => navigate("/add-hall")}>🏫 Add Hall</li>

          {/* VIEW SECTION */}
          <li onClick={() => navigate("/view-staff")}>👥 View Staff</li>
          <li onClick={() => navigate("/view-students")}>📄 View Students</li>
          <li onClick={() => navigate("/view-exams")}>📘 View Exams</li>
          <li onClick={() => navigate("/view-halls")}>🏫 View Halls</li>
          <li onClick={() => navigate("/view-dept")}>🏢 View Department</li>

          {/* LOGS */}
          <li onClick={() => navigate("/view-staff-log")}>📊 Staff Log</li>

          {/* SUPER ADMIN ONLY */}
          {isSuperAdmin && (
            <li onClick={() => navigate("/admin-log")}>🔐 Admin Log</li>
          )}

          {/* OTHER */}
          <li onClick={() => navigate("/create-seating")}>🪑 Create Seating</li>
          <li onClick={() => navigate("/view-seating")}>📌 View Seating</li>
          <li onClick={() => navigate("/admin-profile")}>👤 Profile</li>
          <li onClick={() => navigate("/")}>🚪 Logout</li>
        </ul>
      </aside>

      {/* THIS WILL SHOW THE PAGE CONTENT */}
      <main className="admin-content">{children}</main>
    </div>
  );
}

export default AdminLayout;
