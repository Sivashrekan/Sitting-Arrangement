import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout";
import "../styles/form.css";

function ChangePassword() {
  const navigate = useNavigate();
  const adminId = localStorage.getItem("admin_id");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMsg("Please enter all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("New passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/admin-new-password/${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMsg("Password changed successfully!");

        setTimeout(() => {
          navigate("/admin-profile");
        }, 1500);
      } else {
        setMsg(data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      setMsg("Server error. Try again later.");
    }
  };

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Change Password</h1>

        {msg && <p className="msg">{msg}</p>}

        <form className="form-box" onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="btn">Update Password</button>
        </form>

        <button
          className="back-btn"
          style={{ marginTop: "20px" }}
          onClick={() => navigate("/admin-profile")}
        >
          ← Back to Profile
        </button>
      </div>
    </AdminLayout>
  );
}

export default ChangePassword;
