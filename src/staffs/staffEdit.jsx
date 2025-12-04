import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StaffLayout from "../layouts/stafflayout";
import "../CSS/form.css";

function StaffEdit() {
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staff_id"); // ✔ correct key

  const [staff, setStaff] = useState(null);
  const [message, setMessage] = useState("");

  // Load staff data
  const loadStaff = async () => {
    const res = await fetch(`http://localhost:5000/profile/get-staff/${staffId}`);
    const data = await res.json();
    if (data.success) setStaff(data.staff);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/profile/update-staff/${staffId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: staff.name,
        email: staff.email,
        phone_no: staff.phone_no,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Updated Successfully!");

      // Update localStorage shown in screenshot
      localStorage.setItem("staff_name", staff.name);
      localStorage.setItem("staff_email", staff.email);

      setTimeout(() => navigate("/staff-profile"), 1500);
    } else {
      setMessage("Failed to update!");
    }
  };

  if (!staff)
    return (
      <StaffLayout>
        <h2>Loading...</h2>
      </StaffLayout>
    );

  return (
    <StaffLayout>
      <div className="form-container">
        <h1>Edit Profile</h1>

        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>
          {/* Name */}
          <label>Name</label>
          <input
            name="name"
            value={staff.name}
            onChange={handleChange}
          />

          {/* Email */}
          <label>Email</label>
          <input
            name="email"
            value={staff.email}
            onChange={handleChange}
          />

          {/* Phone */}
          <label>Phone Number</label>
          <input
            name="phone_no"
            value={staff.phone_no || ""}
            onChange={handleChange}
          />

          {/* Department (readonly) */}
          <label>Department</label>
          <input
            value={staff.department_id}
            readOnly
            style={{ background: "#eee" }}
          />

          {/* Role (readonly) */}
          <label>Role</label>
          <input
            value={staff.role}
            readOnly
            style={{ background: "#eee" }}
          />

          <button className="btn">Save Changes</button>
        </form>
      </div>
    </StaffLayout>
  );
}

export default StaffEdit;
