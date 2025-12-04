import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/hallview.css";

function StaffHallView() {
  const { hall_id } = useParams();
  const [hall, setHall] = useState(null);

  const loadHall = async () => {
    const res = await fetch(`http://localhost:5000/staff/get-hall/${hall_id}`);
    const data = await res.json();
    if (data.success) setHall(data.hall);
  };

  useEffect(() => {
    loadHall();
  }, []);

  if (!hall) {
    return (
      <StaffLayout>
        <h2>Loading...</h2>
      </StaffLayout>
    );
  }

  const rows = hall.table_rows;
  const cols = hall.table_columns;

  return (
    <StaffLayout>
      <div className="hall-info">
        <h1>{hall.hall_name}</h1>

        <div className="hall-details">
          <p><b>Rows:</b> {rows}</p>
          <p><b>Columns:</b> {cols}</p>
          <p><b>Total Seats:</b> {hall.total_seats}</p>
        </div>
      </div>

      <div className="seat-grid">
        {Array.from({ length: rows }).map((_, r) => (
          <div className="row" key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <div className="bench" key={c}>
                <div className="seat-row">
                  {[1, 2, 3].map((i) => (
                    <div className={`seat-circle seat-${i}`} key={i}>
                      <span className="seat-label">
                        R{r + 1}C{c + 1}0{i}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </StaffLayout>
  );
}

export default StaffHallView;