import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/form.css";
import "../CSS/viewtable.css";

function ViewSeating() {
  const [departments, setDepartments] = useState([]);
  const [halls, setHalls] = useState([]);
  const [exams, setExams] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [seating, setSeating] = useState([]);

  // 🔥 PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetch("/get-departments").then(r => r.json()).then(d => d.success && setDepartments(d.departments));
    fetch("/get-halls").then(r => r.json()).then(d => d.success && setHalls(d.halls));
    fetch("/get-exams").then(r => r.json()).then(d => d.success && setExams(d.exams));
  }, []);

  const loadSeating = () => {
    let url = "http://localhost:5000/view-seating?";

    if (selectedDept) url += `department_id=${selectedDept}&`;
    if (selectedYear) url += `year=${selectedYear}&`;
    if (selectedExam) url += `exam_id=${selectedExam}&`;
    if (selectedHall) url += `hall_id=${selectedHall}&`;
    if (selectedDate) url += `exam_date=${selectedDate}&`;

    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setSeating(d.seating);
          setCurrentPage(1); // reset pagination when filters applied
        } else {
          setSeating([]);
        }
      });
  };

  // -----------------------------------------------
  // 🔥 PAGINATION LOGIC
  // -----------------------------------------------
  const indexLast = currentPage * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;
  const paginatedData = seating.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(seating.length / rowsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  // -----------------------------------------------

  return (
    <AdminLayout>
      <div className="view-students-container">
        <h1>View Seating Arrangement</h1>

        {/* FILTERS */}
        <div className="filter-row">
          <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1">I</option>
            <option value="2">II</option>
            <option value="3">III</option>
            <option value="4">IV</option>
          </select>

          <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
            <option value="">All Exams</option>
            {exams.map(ex => (
              <option key={ex.exam_id} value={ex.exam_id}>{ex.subject_name}</option>
            ))}
          </select>

          <select value={selectedHall} onChange={e => setSelectedHall(e.target.value)}>
            <option value="">All Halls</option>
            {halls.map(h => (
              <option key={h.hall_id} value={h.hall_id}>{h.hall_name}</option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />

          <button className="apply-btn" onClick={loadSeating}>Apply</button>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Hall</th>
                <th>Seat No</th>
                <th>Exam</th>
                <th>Exam Date</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((s, index) => (
                  <tr key={index}>
                    <td>{s.roll_no}</td>
                    <td>{s.name}</td>
                    <td>{s.department}</td>
                    <td>{s.year}</td>
                    <td>{s.hall_name}</td>
                    <td>{s.seat_no}</td>
                    <td>{s.subject}</td>
                    <td>{s.exam_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">No seating data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔥 PAGINATION BUTTONS */}
        {seating.length > 0 && (
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
    </AdminLayout>
  );
}

export default ViewSeating;