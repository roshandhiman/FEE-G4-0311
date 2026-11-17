import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentStore } from "./store/studentStore";

export default function AddStudent() {
  const navigate = useNavigate();
  const addRecord = useStudentStore((s) => s.addRecord);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !course.trim()) return;
    addRecord({ name: name.trim(), course: course.trim() });
    navigate("/");
  }

  return (
    <div className="page narrow">
      <h1>Add Soul</h1>
      <form className="panel" onSubmit={submit}>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name..."
          autoFocus
        />
        <label>Course</label>
        <input
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Enter course..."
        />
        <div className="actions">
          <button type="submit">Save</button>
          <button type="button" className="dark" onClick={() => navigate("/")}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}