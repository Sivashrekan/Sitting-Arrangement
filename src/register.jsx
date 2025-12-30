import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccess("");

    if (!username || !email || !password || !cpassword) {
      setMessage("All fields are required.");
      return;
    }

    if (password !== cpassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/admin-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Admin registered successfully!");
        setTimeout(() => navigate("/"), 1500); // redirect after success
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("Server error. Please try again.");
    }
  };

  const goToLogin = () => {
    navigate("/adminlog");
  };

  return (
    <div className="body">
      <div className="main">
        <div className="head">
          <h1>Register</h1>
          <hr />

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="cpassword">Confirm Password</label>
            <input
              type="password"
              id="cpassword"
              placeholder="Confirm password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />

            <button type="submit">Register</button>
          </form>

          {message && <p className="error-message">{message}</p>}
          {success && <p className="success-message">{success}</p>}

          <h6>
            Already have an account?{" "}
            <span onClick={goToLogin}>Login here</span>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default Register;
