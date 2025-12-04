import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/staffDashboard.css";

function StaffDashboard() {
  const navigate = useNavigate();

  // correct key
  const deptId = localStorage.getItem("staff_department");
  const staffName = localStorage.getItem("staff_name");

  const [counts, setCounts] = useState({
    students: 0,
    staff: 0,
    halls: 0,
    exams: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deptId) {
      console.log("❌ No department ID found in localStorage");
      navigate("/"); // redirect to login
      return;
    }

    fetch(`http://localhost:5000/staff-dashboard-counts/${deptId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCounts({
            students: data.students,
            staff: data.staff,
            halls: data.halls,
            exams: data.exams,
          });
        }
      })
      .catch((err) => console.log("Dashboard Fetch Error:", err))
      .finally(() => setLoading(false));
  }, [deptId, navigate]);

  if (loading) return <StaffLayout><h2>Loading...</h2></StaffLayout>;

  return (
    <StaffLayout>
      <div className="staff-dashboard">

        <h1 className="welcome">Welcome, {staffName} 👋</h1>
        <p className="subtext">Department ID: {deptId}</p>

        <div className="cards-container">

          <div className="dash-card students">
            <h2>{counts.students}</h2>
            <p>Total Students</p>
          </div>

          <div className="dash-card staff">
            <h2>{counts.staff}</h2>
            <p>Total Staff</p>
          </div>

          <div className="dash-card halls">
            <h2>{counts.halls}</h2>
            <p>Total Halls</p>
          </div>

          <div className="dash-card exams">
            <h2>{counts.exams}</h2>
            <p>Total Exams</p>
          </div>

        </div>

      </div>
    </StaffLayout>
  );
}

export default StaffDashboard;