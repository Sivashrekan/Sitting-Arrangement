import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function StaffLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMsg("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Save staff data
        localStorage.setItem("staff_id", data.teacher_id);
        localStorage.setItem("staff_name", data.name);
        localStorage.setItem("staff_email", data.email);
        localStorage.setItem("staff_department", data.department_id);
        localStorage.setItem("staff_role", data.role);

        navigate("/staff");
      } else {
        setMsg(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMsg("Server error. Try again.");
    }
  };
  const goToForgot = () => {
    navigate("/staff-forgot-password");
  };

  return (
    <div className="body">
      <div className="main">
        <div className="head">
          <h1>Staff Login</h1>
          <hr />

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {msg && <p className="error-message">{msg}</p>}
            <span id="forgot" onClick={goToForgot}>
              Forgot password?
            </span>
            <button type="submit">Login</button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default StaffLogin;