import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminprofile.css";
import AdminLayout from "../layouts/adminlayout";

function AdminProfile() {
  const navigate = useNavigate();
  const adminId = localStorage.getItem("admin_id");

  const [admin, setAdmin] = useState(null);

  const loadAdminData = async () => {
    if (!adminId) return;

    const res = await fetch(`http://localhost:5000/get-admin/${adminId}`);
    const data = await res.json();

    if (data.success) {
      setAdmin(data.admin);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  if (!admin) {
    return (
      <AdminLayout>
        <h2 style={{ padding: "20px" }}>Loading...</h2>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="profile-container">

        <div className="profile-card">

          <div className="profile-row">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              className="profile-img"
              alt="profile"
            />

            <div className="profile-info-block">
              <h2>{admin.username}</h2>
              <p className="profile-email">{admin.email}</p>

              <span
                className={`role-badge ${
                  admin.role === "super_admin" ? "super" : ""
                }`}
              >
                {admin.role === "super_admin" ? "SUPER ADMIN" : "ADMIN"}
              </span>

              <div className="profile-buttons">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-admin/${admin.admin_id}`)}
                >
                  Edit Profile
                </button>

                <button
                  className="edit-btn"
                  onClick={() => navigate(`/change-password/${admin.admin_id}`)}
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
              <p>{admin.username}</p>
            </div>

            <div className="info-row">
              <label>Email</label>
              <p>{admin.email}</p>
            </div>

            <div className="info-row">
              <label>Role</label>
              <p>{admin.role}</p>
            </div>

            <div className="info-row">
              <label>Created At</label>
              <p>{new Date(admin.created_at).toLocaleString()}</p>
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminProfile;
