import React, { useState, useEffect } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [tuser, setTuser] = useState("");
  const [tpass, setTpass] = useState("");
  const [editId, setEditId] = useState(null); // store the id when editing

  const API_URL = "http://127.0.0.1:5000";

  // 🔹 Fetch all users (READ)
  const fetchUsers = () => {
    axios
      .get(`${API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Add new user (CREATE)
  const addUser = () => {
    if (!tuser || !tpass) {
      alert("Please fill in all fields!");
      return;
    }

    axios
      .post(`${API_URL}/add`, { tuser, tpass })
      .then(() => {
        alert("User added successfully!");
        setTuser("");
        setTpass("");
        fetchUsers();
      })
      .catch((err) => console.error(err));
  };

  // 🔹 Start editing a user
  const startEdit = (user) => {
    setEditId(user.tid);
    setTuser(user.tuser);
    setTpass(user.tpass);
  };

  // 🔹 Update user (PUT)
  const updateUser = () => {
    if (!tuser || !tpass) {
      alert("Please fill in all fields!");
      return;
    }

    axios
      .put(`${API_URL}/update/${editId}`, { tuser, tpass })
      .then(() => {
        alert("User updated successfully!");
        setEditId(null);
        setTuser("");
        setTpass("");
        fetchUsers();
      })
      .catch((err) => console.error(err));
  };

  // 🔹 Delete user (DELETE)
  const deleteUser = (id) => {
    axios
      .delete(`${API_URL}/delete/${id}`)
      .then(() => {
        alert("User deleted successfully!");
        fetchUsers();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ margin: "50px" }}>
      <h2>🔥 Flask + React Full CRUD 🔥</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Enter username"
          value={tuser}
          onChange={(e) => setTuser(e.target.value)}
        />
        <input
          placeholder="Enter password"
          type="password"
          value={tpass}
          onChange={(e) => setTpass(e.target.value)}
        />
        {editId ? (
          <button onClick={updateUser}>Update User</button>
        ) : (
          <button onClick={addUser}>Add User</button>
        )}
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setTuser("");
              setTpass("");
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <h3>All Users 👇</h3>
      <ul>
        {users.map((u) => (
          <li key={u.tid}>
            <b>{u.tuser}</b> ({u.tpass})
            <button onClick={() => startEdit(u)}>✏️ Edit</button>
            <button onClick={() => deleteUser(u.tid)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
