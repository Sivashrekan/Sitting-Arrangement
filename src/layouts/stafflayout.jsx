import "../CSS/adminpage.css";
import { useNavigate } from "react-router-dom";

function StaffLayout({ children }) {
  const navigate = useNavigate();

  const staffName = localStorage.getItem("staff_name");
  const deptId = localStorage.getItem("staff_department_id"); 
  const role = localStorage.getItem("role");

  const staffLogout = () => {
  const keys = [
    "staff_id",
    "staff_name",
    "staff_email",
    "staff_department",
    "staff_role",
    "user_password",
  ];

  keys.forEach(key => localStorage.removeItem(key));

  navigate("/");
};

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <aside className="side scroll-sidebar">
        <h2 className="side-title">Staff Panel</h2>

        <ul className="side-menu">

          {/* DASHBOARD */}
          <li onClick={() => navigate("/staff")}>🏠 Dashboard</li>

          {/* MAIN OPTIONS - DEPT FILTERED */}
          <li onClick={() => navigate("/staff/view-students")}>📄 Students (My Dept)</li>
          <li onClick={() => navigate("/staff/view-staff")}>👥 Staff (My Dept)</li>
          <li onClick={() => navigate("/staff/view-exams")}>📝 Exams (My Dept)</li>
          <li onClick={() => navigate("/staff/view-halls")}>🏫 Halls (My Dept)</li>

          {/* SEATING */}
          {/* <li onClick={() => navigate("/staff/create-seating")}>🪑 Create Seating</li> */}
          <li onClick={() => navigate("/staff/view-seating")}>📌 View Seating</li>

          {/* PROFILE */}
          <li onClick={() => navigate("/staff-profile")}>👤 Profile</li>

          {/* LOGOUT */}
          <li onClick={staffLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {/* PAGE CONTENT */}
      <main className="admin-content">{children}</main>
    </div>
  );
}

export default StaffLayout;