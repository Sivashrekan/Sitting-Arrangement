import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/form.css";

function AddExam() {
  const [departments, setDepartments] = useState([]);
  const [exam, setExam] = useState({
    exam_code: "",
    subject_name: "",
    exam_date: "",
    exam_time: "",
    year: "",                         // 🔥 ADDED
    departments_involved: [],         // array of dept IDs
  });

  const [message, setMessage] = useState("");

  // Load departments
  const loadDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/get-departments");
      const data = await res.json();
      if (data.success) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error("Dept load error:", err);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  // Toggle department selection
  const toggleDepartment = (deptId) => {
    let list = [...exam.departments_involved];

    if (list.includes(deptId)) {
      list = list.filter((id) => id !== deptId);
    } else {
      list.push(deptId);
    }

    setExam({ ...exam, departments_involved: list });
  };

  // Submit Exam
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !exam.exam_code ||
      !exam.subject_name ||
      !exam.exam_date ||
      !exam.exam_time ||
      !exam.year
    ) {
      setMessage("⚠ Fill all fields including YEAR.");
      return;
    }

    if (exam.departments_involved.length === 0) {
      setMessage("⚠ Select at least one department.");
      return;
    }

    const payload = {
      ...exam,
      departments_involved: exam.departments_involved.join(","), // CSV
    };

    try {
      const res = await fetch("http://localhost:5000/add-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✔ Exam Added Successfully!");
        setExam({
          exam_code: "",
          subject_name: "",
          exam_date: "",
          exam_time: "",
          year: "",
          departments_involved: [],
        });
      } else {
        setMessage(data.message || "Error adding exam.");
      }
    } catch (err) {
      console.error("Add exam error:", err);
      setMessage("Server error.");
    }
  };

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Add Exam</h1>

        {message && <p className="msg">{message}</p>}

        <form className="form-box" onSubmit={handleSubmit}>
          <label>Exam Code</label>
          <input
            type="text"
            name="exam_code"
            value={exam.exam_code}
            onChange={handleChange}
            placeholder="Eg: EXM101"
          />

          <label>Subject Name</label>
          <input
            type="text"
            name="subject_name"
            value={exam.subject_name}
            onChange={handleChange}
            placeholder="Enter subject name"
          />

          <label>Exam Date</label>
          <input
            type="date"
            name="exam_date"
            value={exam.exam_date}
            onChange={handleChange}
          />

          <label>Exam Time</label>
          <input
            type="time"
            name="exam_time"
            value={exam.exam_time}
            onChange={handleChange}
          />

          {/* YEAR SELECTION */}
          <label>Select Year</label>
          <select name="year" value={exam.year} onChange={handleChange}>
            <option value="">-- Select Year --</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          {/* DEPARTMENTS */}
          <label>Departments Involved</label>
          <div className="dept-buttons">
            {departments.map((d) => {
              const selected = exam.departments_involved.includes(d.department_id);
              return (
                <button
                  key={d.department_id}
                  type="button"
                  className={selected ? "dept-btn selected" : "dept-btn"}
                  onClick={() => toggleDepartment(d.department_id)}
                >
                  {d.department_name}
                </button>
              );
            })}
          </div>

          <button type="submit" className="btn">Add Exam</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddExam;
