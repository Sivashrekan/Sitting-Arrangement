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

  // 🔥 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Load exams
  useEffect(() => {
    fetch(`http://localhost:5000/staff/exams/${deptId}`)
      .then((res) => res.json())
      .then((data) => data.success && setExams(data.exams));
  }, [deptId]);

  // Load dates
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
      .then((data) => {
        if (data.success) {
          setSeating(data.seating);
          setCurrentPage(1); // reset pagination
        } else {
          setSeating([]);
        }
      });
  }, [selectedExam, selectedDate, deptId]);

  // 🔍 Search filter
  const filtered = seating.filter((s) =>
    s.student_name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(search.toLowerCase()) ||
    s.hall_name.toLowerCase().includes(search.toLowerCase()) ||
    s.seat_no.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 Pagination logic (AFTER search)
  const indexLast = currentPage * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;
  const paginatedData = filtered.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <StaffLayout>
      <div className="table-container">
        <h1>Seating Arrangement</h1>

        {/* FILTERS */}
        <div className="filter-box">
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

          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={!selectedExam}
          >
            <option value="">Select Assigned Date</option>
            {dates.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name / roll / hall / seat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
          style={{ width: "300px", marginBottom: "20px" }}
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
            {paginatedData.length > 0 ? (
              paginatedData.map((s, i) => (
                <tr key={i}>
                  <td>{indexFirst + i + 1}</td>
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

        {/* 🔥 PAGINATION */}
        {filtered.length > 0 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={prevPage}>
              ◀ Prev
            </button>

            <span>
              Page {currentPage} / {totalPages}
            </span>

            <button disabled={currentPage === totalPages} onClick={nextPage}>
              Next ▶
            </button>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

export default StaffViewSeating;