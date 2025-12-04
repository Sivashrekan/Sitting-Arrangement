import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/form.css";

function StaffChangePassword() {
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staff_id"); // ✔ FIXED

  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      setMessage("Passwords do not match!");
      return;
    }

    const res = await fetch(`http://localhost:5000/profile/change-password/${staffId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_password: password }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Password changed successfully!");
      setTimeout(() => navigate("/staff-profile"), 1500);
    } else {
      setMessage("Failed to change password.");
    }
  };

  return (
    <StaffLayout>
      <div className="form-container">
        <h1>Change Password</h1>

        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>
          
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <button className="btn">Update Password</button>
        </form>
      </div>
    </StaffLayout>
  );
}

export default StaffChangePassword;