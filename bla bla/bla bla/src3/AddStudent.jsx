import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentStore } from "./useStudentStore";

export default function AddStudent() {
  const navigate = useNavigate();
  const addRecord = useStudentStore((s) => s.addRecord);

  const [formData, setFormData] = useState({
    roll_number: "",
    name: "",
    section: "",
    marks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roll_number.trim()) return;

    addRecord({
      roll_number: formData.roll_number.trim(),
      name: formData.name.trim(),
      section: formData.section.trim(),
      marks: Number(formData.marks) || 0,
    });
    navigate("/students");
  };

  return (
    <div className="page narrow">
      <header className="bar">
        <h1>Add Student</h1>
      </header>

      <form className="panel" onSubmit={handleSubmit}>
        <label htmlFor="roll_number">Roll Number</label>
        <input
          id="roll_number"
          name="roll_number"
          value={formData.roll_number}
          onChange={handleChange}
          placeholder="e.g. 104"
          required
          autoFocus
        />

        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Rahul"
          required
        />

        <label htmlFor="section">Section</label>
        <input
          id="section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          placeholder="e.g. G4"
          required
        />

        <label htmlFor="marks">Marks</label>
        <input
          id="marks"
          type="number"
          name="marks"
          value={formData.marks}
          onChange={handleChange}
          placeholder="e.g. 88"
          required
        />

        <div className="actions">
          <button type="submit">Save Student</button>
          <button
            type="button"
            className="dark"
            onClick={() => navigate("/students")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
