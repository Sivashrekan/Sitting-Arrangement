import { useEffect, useState } from "react";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/viewtable.css";

function StaffViewStaff() {
  const deptId = localStorage.getItem("staff_department");  // ✔ correct key
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/staff/view-staff/${deptId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStaffs(data.staffs);
      });
  }, [deptId]);

  return (
    <StaffLayout>
      <div className="table-container">
        <h1>Staff Members (My Department)</h1>

        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {staffs.length > 0 ? (
              staffs.map((st, i) => (
                <tr key={st.teacher_id}>
                  <td>{i + 1}</td>
                  <td>{st.name}</td>
                  <td>{st.email}</td>
                  <td>{st.phone_no || "—"}</td>
                  <td>{st.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No staff found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}

export default StaffViewStaff;