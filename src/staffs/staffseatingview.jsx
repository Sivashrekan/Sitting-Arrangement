import { useEffect, useState } from "react";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/viewtable.css";

function StaffViewSeating() {
  const deptId = localStorage.getItem("staff_department");

  const [exams, setExams] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [seating, setSeating] = useState([]);
  const [search, setSearch] = useState("");

  // Load exams
  useEffect(() => {
    fetch(`http://localhost:5000/staff/exams/${deptId}`)
      .then((res) => res.json())
      .then((data) => data.success && setExams(data.exams));
  }, [deptId]);

  // Load dates (created_at)
  useEffect(() => {
    if (!selectedExam) return;

    fetch(`http://localhost:5000/staff/seating-dates/${selectedExam}`)
      .then((res) => res.json())
      .then((data) => data.success && setDates(data.dates));
  }, [selectedExam]);

  // Load seating
  useEffect(() => {
    if (!selectedExam || !selectedDate) return;

    fetch(
      `http://localhost:5000/staff/view-seating/${selectedExam}/${deptId}/${selectedDate}`
    )
      .then((res) => res.json())
      .then((data) => data.success && setSeating(data.seating));
  }, [selectedExam, selectedDate, deptId]);

  // Filter logic
  const filtered = seating.filter((s) =>
    s.student_name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(search.toLowerCase()) ||
    s.hall_name.toLowerCase().includes(search.toLowerCase()) ||
    s.seat_no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <StaffLayout>
      <div className="table-container">
        <h1>Seating Arrangement</h1>

        {/* FILTERS */}
        <div className="filter-box">

          {/* Exam dropdown */}
          <select
            value={selectedExam}
            onChange={(e) => {
              setSelectedExam(e.target.value);
              setSelectedDate("");
              setSeating([]);
            }}
          >
            <option value="">Select Exam</option>
            {exams.map((ex) => (
              <option key={ex.exam_id} value={ex.exam_id}>
                {ex.subject_name} ({ex.exam_code})
              </option>
            ))}
          </select>

          {/* Date dropdown */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={!selectedExam}
          >
            <option value="">Select Assigned Date</option>
            {dates.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* SEARCH BOX */}
        <input
          type="text"
          placeholder="Search by name / roll / hall / seat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
          style={{
            padding: "10px",
            borderRadius: "8px",
            width: "300px",
            marginBottom: "20px",
          }}
        />

        {/* TABLE */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Hall</th>
              <th>Seat No</th>
              <th>Roll No</th>
              <th>Student</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{s.hall_name}</td>
                  <td>{s.seat_no}</td>
                  <td>{s.roll_no}</td>
                  <td>{s.student_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  {selectedExam && selectedDate
                    ? "No matching results."
                    : "Select exam & assigned date."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}

export default StaffViewSeating;