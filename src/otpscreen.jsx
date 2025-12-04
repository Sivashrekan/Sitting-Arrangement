import { useState, useRef, useEffect } from "react";
import "./otp.css";

function OtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false); // shows reset form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRefs = useRef([]);

  // start 5-minute timer
  const startTimer = () => {
    const expiryTime = Date.now() + 5 * 60 * 1000;
    localStorage.setItem("otp_expiry", expiryTime);
    setExpired(false);
  };

  // persistent timer even after refresh
  useEffect(() => {
    const expiryTime = localStorage.getItem("otp_expiry");
    const now = Date.now();
    if (!expiryTime || now > Number(expiryTime)) startTimer();

    const timerInterval = setInterval(() => {
      const expiry = localStorage.getItem("otp_expiry");
      if (!expiry) return;
      const remaining = Math.floor((expiry - Date.now()) / 1000);
      if (remaining <= 0) {
        setExpired(true);
        setTimeLeft(0);
        clearInterval(timerInterval);
      } else {
        setExpired(false);
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (index < 5 && value !== "") inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1].focus();
  };

  // ✅ Verify OTP via Flask backend
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (expired) {
      alert("❌ OTP expired! Please request a new one.");
      return;
    }

    const enteredOtp = otp.join("");
    const email = localStorage.getItem("email");

    try {
      console.log("Sending OTP data:", { email, otp: enteredOtp });
      const response = await fetch("http://127.0.0.1:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ OTP Verified Successfully!");
        setOtpVerified(true); // now show reset password section
        localStorage.removeItem("otp_expiry");
      } else {
        alert("❌ Invalid OTP. Please try again.");
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  // ✅ Resend OTP via Flask
  const handleResend = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Email missing. Please go back.");
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
        alert("🔁 New OTP sent to your email!");
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();
        startTimer();
      } else {
        alert("❌ Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
  
    const email = localStorage.getItem("email");
  
    try {
      const response = await fetch("http://127.0.0.1:5000/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
    
      const data = await response.json();
    
      if (data.success) {
        alert("✅ Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setOtpVerified(false);
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  };


  return (
    <div className="body">
      <div className="main">
        <div className="head">
          {!otpVerified ?(<h1>OTP Verification</h1>):(<h1>Reset Password</h1>)}
          <hr />

          {!otpVerified ? (
            <form onSubmit={handleVerifyOtp}>
              <label>Enter 6-digit OTP</label>
              <div className="otp-container">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => (inputRefs.current[i] = el)}
                    className="otp-box"
                  />
                ))}
              </div>

              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {expired ? (
                  <span style={{ color: "red" }}>OTP expired!</span>
                ) : (
                  <span style={{ color: "#4a5568" }}>
                    Time remaining: <b>{formatTime(timeLeft)}</b>
                  </span>
                )}
              </div>

              {expired ? (
                <button type="button" onClick={handleResend}>
                  Resend OTP
                </button>
              ) : (
                <button type="submit">Verify OTP</button>
              )}
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <h2 style={{ textAlign: "center", color: "#2d3748" }}>
                Reset Password
              </h2>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit">Update Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtpPage;
