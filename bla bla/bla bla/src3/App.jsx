import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentStore } from "./useStudentStore";

export default function App() {
  const navigate = useNavigate();
  const { students, getRecords, deleteRecord, isLoading, isAuthenticated, currentUser } = useStudentStore();

  useEffect(() => {
    getRecords();
  }, [getRecords]);

  return (
    <div className="page">
      <header className="bar">
        <div>
          <h1>Student Portal</h1>
          {currentUser && <p className="fss" style={{ color: "var(--blood-hi)" }}>Active Hunter: {currentUser}</p>}
        </div>
        <div className="actions">
          <button onClick={() => navigate("/add")}>+ Add Student</button>
          {isAuthenticated ? (
            <button className="dark" onClick={() => navigate("/logout")}>
              Logout
            </button>
          ) : (
            <button className="dark" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </header>

      {isLoading && <p className="msg">Loading records...</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Roll No</th>
            <th>Name</th>
            <th>Section</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="6">No student records found</td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.roll_number}</td>
                <td>{s.name}</td>
                <td>{s.section}</td>
                <td>{s.marks}</td>
                <td>
                  <div className="actions">
                    <button
                      className="edit"
                      onClick={() => navigate(`/update/${s.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => deleteRecord(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
