import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/admin-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("admin_id", data.admin_id);
        localStorage.setItem("adminName", data.username);
        localStorage.setItem("adminEmail", data.email);
        localStorage.setItem("role", data.role);
        alert("Login Successful!");
        setMessage("");
        navigate("/admin"); 
      } else {
        setMessage(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToForgot = () => {
    navigate("/forgot");
  };

  return (
    <div className="body">
      <div className="main">
        <div className="head">
          <h1>Admin Login</h1>
          <hr />

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {message && <p className="error-message">{message}</p>}
            <span id="forgot" onClick={goToForgot}>
              Forgot password?
            </span>

            <button type="submit">Login</button>
          </form>

          <h6>
            If you don't have an account,{" "}
            <span onClick={goToRegister}>Register here</span>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default Login;
