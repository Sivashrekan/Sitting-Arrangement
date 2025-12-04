import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";

function StudentLogin() {
  const navigate = useNavigate();

  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rollNo || !dob) {
      setMsg("Please enter Roll Number and Date of Birth.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roll_no: rollNo,
          date_of_birth: dob
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Save student data
        localStorage.setItem("student_id", data.student_id);
        localStorage.setItem("student_name", data.name);
        localStorage.setItem("student_roll", data.roll_no);
        localStorage.setItem("student_department", data.department_id);
        localStorage.setItem("student_year", data.current_year);

        navigate("/student-dashboard");
      } else {
        setMsg(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMsg("Server error. Please try again.");
    }
  };

  return (
    <div className="body">
      <div className="main">
        <div className="head">
          <h1>Student Login</h1>

          <form onSubmit={handleSubmit}>
            
            <label>Roll Number</label>
            <input 
              type="text"
              placeholder="Enter Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />

            <label>Date of Birth</label>
            <input 
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />

            {msg && <p className="error-message">{msg}</p>}

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;