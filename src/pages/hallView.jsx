import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/hallview.css";

function HallView() {
  const { hall_id } = useParams();
  const [hall, setHall] = useState(null);

  const loadHall = async () => {
    const res = await fetch("http://localhost:5000/get-halls");
    const data = await res.json();
    if (data.success) {
      const selected = data.halls.find((h) => h.hall_id == hall_id);
      setHall(selected);
    }
  };

  useEffect(() => {
    loadHall();
  }, []);

  if (!hall) {
    return (
      <AdminLayout>
        <h2>Loading...</h2>
      </AdminLayout>
    );
  }

  const rows = hall.table_rows;
  const cols = hall.table_columns;

  const seatClick = (r, c, i) => {
    alert(`Seat No: R${r}C${c}0${i}`);
  };

  return (
    <AdminLayout>
        <div className="hall-info">
          <h1>{hall.hall_name}</h1>

          <div className="hall-details">
            <p><b>Rows:</b> {rows}</p>
            <p><b>Columns:</b> {cols}</p>
            <p><b>Total Seats:</b> {hall.total_seats}</p>
            <p><b>Department:</b> {hall.department_name}</p>
          </div>
        </div>

      <div className="seat-grid">
        {Array.from({ length: rows }).map((_, r) => (
          <div className="row" key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <div className="bench">
                <div className="seat-row">
                  {[1, 2, 3].map((i) => (
                    <div className={`seat-circle seat-${i}`}
                         key={i}
                         onClick={() => seatClick(r + 1, c + 1, i)}
                    >
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
    </AdminLayout>
  );
}

export default HallView;
