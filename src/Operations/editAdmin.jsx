import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/adminlayout";
import "../styles/form.css";

function EditAdmin() {
  const navigate = useNavigate();
  const adminId = localStorage.getItem("admin_id");

  const [admin, setAdmin] = useState(null);
  const [message, setMessage] = useState("");

  const loadAdmin = async () => {
    const res = await fetch(`http://localhost:5000/get-admin/${adminId}`);
    const data = await res.json();
    if (data.success) setAdmin(data.admin);
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/update-admin/${adminId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("adminName", admin.username);
      localStorage.setItem("adminEmail", admin.email);

      setMessage("Profile Updated!");

      setTimeout(() => {
        navigate("/admin-profile");
      }, 1500);
    } else {
      setMessage("Update failed!");
    }
  };

  if (!admin)
    return (
      <AdminLayout>
        <h2>Loading...</h2>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Edit Profile</h1>
        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="username" value={admin.username} onChange={handleChange} />

          <label>Email</label>
          <input name="email" value={admin.email} onChange={handleChange} />

          <button className="btn">Save Changes</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditAdmin;
