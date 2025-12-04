import { useEffect, useState } from "react";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/viewtable.css";

function StaffViewExams() {
  const deptId = localStorage.getItem("staff_department"); // ✔ correct key
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/staff/exams/${deptId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setExams(data.exams);
      });
  }, [deptId]);

  return (
    <StaffLayout>
      <div className="table-container">
        <h1>Exams (My Department)</h1>

        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Exam Code</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {exams.length > 0 ? (
              exams.map((e, i) => (
                <tr key={e.exam_id}>
                  <td>{i + 1}</td>
                  <td>{e.exam_code}</td>
                  <td>{e.subject_name}</td>
                  <td>{e.exam_date}</td>
                  <td>{e.exam_time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}

export default StaffViewExams;