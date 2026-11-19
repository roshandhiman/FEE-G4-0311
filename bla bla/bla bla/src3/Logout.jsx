import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentStore } from "./useStudentStore";

export default function Logout() {
  const navigate = useNavigate();
  const logout = useStudentStore((s) => s.logout);

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="page narrow">
      <h1>You Escaped</h1>
      <div className="panel">
        <p className="msg">The hunt is over... for now. You have been safely logged out.</p>
        <div className="actions">
          <button onClick={() => navigate("/login")}>Login Again</button>
          <button className="dark" onClick={() => navigate("/students")}>
            Student Portal
          </button>
        </div>
      </div>
    </div>
  );
}
