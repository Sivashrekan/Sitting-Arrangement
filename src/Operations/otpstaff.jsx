import { useState, useRef, useEffect } from "react";
import "../styles/otp.css";

function OtpStaff() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const [otpVerified, setOtpVerified] = useState(false);
  const [msg, setMsg] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Check email
  useEffect(() => {
    const email = localStorage.getItem("staff_email");
    if (!email) {
      alert("Email missing! Start again.");
      window.location.href = "/staff-forgot-password";
    }
  }, []);

  // Start timer
  const startTimer = () => {
    const expiry = Date.now() + 5 * 60 * 1000;
    localStorage.setItem("staff_otp_expiry", expiry);
    setExpired(false);
  };

  useEffect(() => {
    const expiryTime = localStorage.getItem("staff_otp_expiry");
    if (!expiryTime) startTimer();

    const timer = setInterval(() => {
      const expiry = localStorage.getItem("staff_otp_expiry");
      if (!expiry) return;

      const remaining = Math.floor((expiry - Date.now()) / 1000);

      if (remaining <= 0) {
        setExpired(true);
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle OTP input
  const handleChange = (el, index) => {
    const val = el.value.replace(/\D/, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1].focus();
  };

  // Verify OTP
  const verifyOtp = async () => {
    const email = localStorage.getItem("staff_email");
    const entered = otp.join("");

    try {
      const response = await fetch("http://localhost:5000/staff-verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: entered }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        localStorage.removeItem("staff_otp_expiry");
      } else {
        alert("Invalid OTP");
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();
      }
    } catch {
      alert("Server error.");
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    const email = localStorage.getItem("staff_email");

    const res = await fetch("http://localhost:5000/staff-send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      alert("New OTP sent!");
      startTimer();
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();
    }
  };

  // Reset password
  const resetPassword = async () => {
  if (newPass !== confirmPass) {
    alert("Passwords do not match!");
    return;
  }

  const email = localStorage.getItem("staff_email");

  try {
    const response = await fetch("http://localhost:5000/staff-reset-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password: newPass }),
    });

    const data = await response.json();

    if (data.success) {
      setMsg("Password reset successfully!");

      // Clear storage so OTP can't be reused
      localStorage.removeItem("staff_email");
      localStorage.removeItem("staff_otp_expiry");

      // Redirect to staff login after 2 seconds
      setTimeout(() => {
        window.location.href = "/staff-login";
      }, 2000);

      // Clear fields
      setNewPass("");
      setConfirmPass("");

    } else {
      setMsg(data.message);
    }

  } catch (err) {
    console.error(err);
    alert("Server error.");
  }
};


  return (
    <div className="body">
      <div className="main">
        <div className="head">

          {!otpVerified ? (
            <>
              <h1>Staff OTP Verification</h1>

              <div className="otp-container">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleChange(e.target, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => (inputRefs.current[i] = el)}
                  />
                ))}
              </div>

              <p style={{ textAlign: "center" }}>
                {expired ? (
                  <span style={{ color: "red" }}>OTP Expired</span>
                ) : (
                  <>Time Remaining: <b>{formatTime(timeLeft)}</b></>
                )}
              </p>

              {!expired ? (
                <button onClick={verifyOtp}>Verify OTP</button>
              ) : (
                <button onClick={resendOTP}>Resend OTP</button>
              )}
            </>
          ) : (
            <>
              <h1>Reset Password</h1>

              <label>New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />

              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />

              <button onClick={resetPassword}>Update Password</button>

              {msg && (
                <p style={{ color: "green", fontWeight: "bold" }}>{msg}</p>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default OtpStaff;