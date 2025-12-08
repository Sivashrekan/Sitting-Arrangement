import { useEffect, useState } from "react";
import AdminLayout from "../layouts/adminlayout";
import "../CSS/form.css";

function CreateSeating() {
  const [departments, setDepartments] = useState([]);
  const [allHalls, setAllHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  const [examMapping, setExamMapping] = useState({}); 
  const [yearWiseExams, setYearWiseExams] = useState({}); 

  const [selectedHalls, setSelectedHalls] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [msg, setMsg] = useState("");

  // Load departments + halls
  useEffect(() => {
    fetch("/get-departments")
      .then((r) => r.json())
      .then((d) => d.success && setDepartments(d.departments));

    fetch("/get-halls")
      .then((r) => r.json())
      .then((d) => d.success && setAllHalls(d.halls));
  }, []);

  // Filter halls based on department selection
  useEffect(() => {
    if (selectedDepartments.length === 0) {
      setFilteredHalls([]);
      return;
    }

    const halls = allHalls.filter(
      (h) =>
        h.department_name === "General Hall" ||
        selectedDepartments.includes(h.department_id)
    );

    setFilteredHalls(halls);
  }, [selectedDepartments, allHalls]);

  // Load exams PER YEAR + PER DEPT
  useEffect(() => {
    selectedYears.forEach((yr) => {
      fetch("/get-exams-by-dept-year", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: yr,
          departments: selectedDepartments,
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setYearWiseExams((prev) => ({
              ...prev,
              [yr]: d.exams,
            }));
          }
        });
    });
  }, [selectedYears, selectedDepartments]);

  // Toggle selectors
  const toggleDepartment = (id) => {
    id = Number(id);
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleYear = (yr) => {
    setSelectedYears((prev) =>
      prev.includes(yr) ? prev.filter((x) => x !== yr) : [...prev, yr]
    );
  };

  const toggleHall = (id) => {
    setSelectedHalls((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Submit seating request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (selectedDepartments.length === 0)
      return setMsg("⚠ Select at least one department.");
    if (selectedYears.length === 0)
      return setMsg("⚠ Select at least one year.");
    if (selectedHalls.length === 0)
      return setMsg("⚠ Select at least one hall.");
    if (!selectedDate)
      return setMsg("⚠ Select exam date.");

    for (const yr of selectedYears) {
      if (!examMapping[yr]) {
        return setMsg(`⚠ Select exam for ${yr} Year.`);
      }
    }

    const payload = {
      departments: selectedDepartments,
      years: selectedYears,
      halls: selectedHalls,
      exam_date: selectedDate,
      exam_mapping: examMapping,
    };

    const res = await fetch("/generate-seating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      setMsg(`✔ Seating created! ${data.assigned} students arranged.`);
    } else {
      setMsg(data.message || "Failed to create seating.");
    }
  };

  return (
    <AdminLayout>
      <div className="form-container">
        <h1>Create Seating Arrangement</h1>

        {msg && <p className="msg">{msg}</p>}

        <form className="form-box" onSubmit={handleSubmit}>

          {/* Departments */}
          <label>Select Departments</label>
          <div className="multi-box">
            {departments.map((d) => (
              <div
                key={d.department_id}
                className={`multi-item ${
                  selectedDepartments.includes(d.department_id) ? "active" : ""
                }`}
                onClick={() => toggleDepartment(d.department_id)}
              >
                {d.department_name}
              </div>
            ))}
          </div>

          {/* Years */}
          <label>Select Years</label>
          <div className="multi-box">
            {[1, 2, 3, 4].map((yr) => (
              <div
                key={yr}
                className={`multi-item ${
                  selectedYears.includes(yr) ? "active" : ""
                }`}
                onClick={() => toggleYear(yr)}
              >
                {yr} Year
              </div>
            ))}
          </div>

          {/* PER YEAR EXAM DROPDOWNS */}
          <label>Select Exam For Each Year</label>
          {selectedYears.map((yr) => (
            <div key={yr} style={{ marginBottom: "10px" }}>
              <strong>{yr} Year</strong>
              <select
                value={examMapping[yr] || ""}
                onChange={(e) =>
                  setExamMapping((prev) => ({
                    ...prev,
                    [yr]: Number(e.target.value),
                  }))
                }>
                <option value="">-- Select Exam --</option>
                {(yearWiseExams[yr] || []).map((ex) => (
                  <option key={ex.exam_id} value={ex.exam_id}>
                    {ex.subject_name} ({ex.exam_code})
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Halls */}
          <label>Select Exam Halls</label>
          <div className="multi-box">
            {filteredHalls.length === 0 && (
              <p>No halls for selected departments.</p>
            )}

            {filteredHalls.map((h) => (
              <div
                key={h.hall_id}
                className={`multi-item ${
                  selectedHalls.includes(h.hall_id) ? "active" : ""
                }`}
                onClick={() => toggleHall(h.hall_id)}>
                {h.hall_name} — {h.total_seats} seats
              </div>
            ))}
          </div>

          {/* Date */}
          <label>Select Exam Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button className="btn">Generate Seating</button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default CreateSeating;
