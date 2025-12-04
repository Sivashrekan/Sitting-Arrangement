import { useEffect, useState } from "react";
import "../CSS/studentDashboard.css";

function StudentDashboard() {
  const studentId = localStorage.getItem("student_id");
  const studentName = localStorage.getItem("student_name");
  const roll = localStorage.getItem("student_roll");
  const year = localStorage.getItem("student_year");
  const dept = localStorage.getItem("student_department");

  const [seatings, setSeatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("student_id");
    localStorage.removeItem("student_name");
    localStorage.removeItem("student_roll");
    localStorage.removeItem("student_year");
    localStorage.removeItem("student_department");

    window.location.href = "/";
  };

  const loadSeating = async () => {
    try {
      const res = await fetch(`http://localhost:5000/get-student-seating/${studentId}`);
      const data = await res.json();

      if (data.success && data.assigned) {
        setSeatings(data.seatings);
      } else {
        setSeatings([]);
      }

      setLoading(false);
    } catch (err) {
      console.log("Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeating();
  }, []);

  const dateList = [...new Set(seatings.map(s => s.exam_date))];

  const filtered = selectedDate
    ? seatings.filter(s => s.exam_date === selectedDate)
    : [];

  return (
    <div className="student-dashboard">

      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <div className="student-card">
        <h1>Welcome, {studentName}</h1>

        <div className="info-box">
          <p><b>Roll No:</b> {roll}</p>
          <p><b>Year:</b> {year}</p>
          <p><b>Department ID:</b> {dept}</p>
        </div>
      </div>

      <div className="seating-card">
        <h2>Your Seating Arrangement</h2>

        {loading && <p>Loading seating details...</p>}

        {!loading && seatings.length === 0 && (
          <p className="no-seat">No seating assigned yet.</p>
        )}

        {!loading && seatings.length > 0 && (
          <div className="filter-box">
            <label><b>Select Exam Date:</b></label>
            <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
              <option value="">-- Select --</option>
              {dateList.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {!loading && seatings.length > 0 && !selectedDate && (
          <p style={{ color: "red" }}>Please select a date to view seating.</p>
        )}

        {selectedDate && filtered.length > 0 && (
          filtered.map((s, i) => (
            <div className="seat-details" key={i}>
              <p><b>Exam:</b> {s.subject_name} ({s.exam_code})</p>
              <p><b>Date:</b> {s.exam_date}</p>
              <p><b>Time:</b> {s.exam_time}</p>
              <p><b>Hall:</b> {s.hall_name}</p>
              <p><b>Seat Number:</b> <span className="seat-number">{s.seat_no}</span></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
