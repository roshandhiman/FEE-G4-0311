import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentStore } from "./store/studentStore";

export function StudentsApp() {
  const navigate = useNavigate();
  const { students, getRecords, deleteRecord } = useStudentStore();

  useEffect(() => {
    getRecords();
  }, [getRecords]);

  function logout() {
    navigate("/logout");
  }

  function addRecord() {
    navigate("/add");
  }

  return (
    <div className="page">
      <header className="bar">
        <h1>Students</h1>
        <div className="actions">
          <button onClick={addRecord}>+ Add</button>
          <button className="dark" onClick={logout}>Logout</button>
        </div>
      </header>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr>
              <td colSpan="4">The graveyard is empty</td>
            </tr>
          )}
          {students.map((s) => (
            <tr key={s.id}>
              <td>{String(s.id).slice(-4)}</td>
              <td>{s.name}</td>
              <td>{s.course}</td>
              <td>
                <button className="danger" onClick={() => deleteRecord(s.id)}>
                  Kill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}