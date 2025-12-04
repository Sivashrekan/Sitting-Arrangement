import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/adminprofile.css";
import StaffLayout from "../layouts/stafflayout";

function StaffProfile() {
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staff_id");   // ✔ FIXED
  const [staff, setStaff] = useState(null);

  const loadStaffData = async () => {
    if (!staffId) {
      console.log("No staff_id found in localStorage");
      return;
    }

    const res = await fetch(`http://localhost:5000/profile/get-staff/${staffId}`);
    const data = await res.json();

    if (data.success) {
      setStaff(data.staff);
    }
  };

  useEffect(() => {
    loadStaffData();
  }, []);

  if (!staff) {
    return (
      <StaffLayout>
        <h2 style={{ padding: "20px" }}>Loading...</h2>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="profile-container">
        <button className="back-small" onClick={() => navigate("/staff")}>
          ← Dashboard
        </button>

        <div className="profile-card">
          <div className="profile-row">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              className="profile-img"
              alt="profile"
            />

            <div className="profile-info-block">
              <h2>{staff.name}</h2>
              <p className="profile-email">{staff.email}</p>

              <span className="role-badge">{staff.role?.toUpperCase()}</span>

              <div className="profile-buttons">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/staff-edit/${staff.teacher_id}`)}
                >
                  Edit Profile
                </button>

                <button
                  className="edit-btn"
                  onClick={() => navigate(`/staff-change-password/${staff.teacher_id}`)}
                  style={{ marginLeft: "10px", background: "#ffb300", color: "#0b0d36" }}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="profile-info">
            <h3>Account Information</h3>

            <div className="info-row">
              <label>Name</label>
              <p>{staff.name}</p>
            </div>

            <div className="info-row">
              <label>Email</label>
              <p>{staff.email}</p>
            </div>

            <div className="info-row">
              <label>Phone Number</label>
              <p>{staff.phone_no || "Not Provided"}</p>
            </div>

            <div className="info-row">
              <label>Department ID</label>
              <p>{staff.department_id}</p>
            </div>

            <div className="info-row">
              <label>Role</label>
              <p>{staff.role}</p>
            </div>

            <div className="info-row">
              <label>Created At</label>
              <p>{new Date(staff.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>
    </StaffLayout>
  );
}

export default StaffProfile;