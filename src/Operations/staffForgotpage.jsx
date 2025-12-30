import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function StaffForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const sendOTP = async () => {
    setMsg("");

    if (!email) {
      setMsg("Please enter email");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/staff-send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("staff_email", email);
        window.location.href = "/staff-otp";  // Go to OTP page
      } else {
        setMsg(data.message);
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error. Try again.");
    }
  };

  return (
    <div className="body">
      <div className="main">
        <div className="head">
          <h1>Staff Forgot Password</h1>
          <hr />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter registered staff email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={sendOTP}>Send OTP</button>

          {msg && <p className="error-message">{msg}</p>}
        </div>
      </div>
    </div>
  );
}

export default StaffForgotPassword;
