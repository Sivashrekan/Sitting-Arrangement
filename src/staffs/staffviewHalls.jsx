import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/viewtable.css";

function StaffViewHalls() {
  const deptId = localStorage.getItem("staff_department"); // ✔ correct key
  const [halls, setHalls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/staff/view-halls/${deptId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHalls(data.halls);
      });
  }, [deptId]);

  return (
    <StaffLayout>
      <div className="table-container">
        <h1>Halls (My Department)</h1>

        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Hall Name</th>
              <th>Total Seats</th>
              <th>Rows</th>
              <th>Columns</th>
              <th>Options</th> {/* ❤️ Added */}
            </tr>
          </thead>

          <tbody>
            {halls.length > 0 ? (
              halls.map((h, i) => (
                <tr key={h.hall_id}>
                  <td>{i + 1}</td>
                  <td>{h.hall_name}</td>
                  <td>{h.total_seats}</td>
                  <td>{h.table_rows}</td>
                  <td>{h.table_columns}</td>

                  {/* VIEW BUTTON */}
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/staff/view-hall/${h.hall_id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No halls available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}

export default StaffViewHalls;