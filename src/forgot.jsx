import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './login.css';

function Forgot() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      alert("Please enter your email address");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ OTP has been sent to your Gmail!");
        localStorage.setItem("email", email);
        navigate("/otp"); 
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  const goToLogin = () => {
    navigate('/adminlog');
  };

  return (
    <div className="body">
      <div className="main">
        <div className="head">
          <h1>Forgot Password</h1>
          <hr />
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your Gmail ID" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Send OTP</button>
          </form>
          <h6>
            Already have an account?{" "}
            <span onClick={goToLogin}>Login here</span>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
