import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentStore } from "./useStudentStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useStudentStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields");
      return;
    }
    login(username.trim());
    navigate("/students");
  };

  return (
    <div className="page narrow">
      <header className="bar">
        <h1>Hunter Access</h1>
      </header>

      <form className="panel" onSubmit={handleSubmit}>
        {error && <p className="msg error-text">{error}</p>}

        <label htmlFor="username">Operator / Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          placeholder="Enter username..."
          autoFocus
          required
        />

        <label htmlFor="password">Passcode</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="Enter passcode..."
          required
        />

        <div className="actions">
          <button type="submit">Enter Realm</button>
          <button
            type="button"
            className="dark"
            onClick={() => {
              login("Hunter");
              navigate("/students");
            }}
          >
            Quick Guest Entry
          </button>
        </div>
      </form>
    </div>
  );
}
