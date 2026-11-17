import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  return (
    <div className="page narrow">
      <h1>You Escaped</h1>
      <div className="panel">
        <p className="msg">The hunt is over... for now.</p>
        <div className="actions">
          <button onClick={() => navigate("/")}>Return</button>
        </div>
      </div>
    </div>
  );
}