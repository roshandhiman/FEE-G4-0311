import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function NavBar() {
  const { isLogin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-icon" title="Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </div>

      {isLogin && (
        <div className="nav-center">
          <NavLink to="/about" className="nav-link">About</NavLink>
          <NavLink to="/product" className="nav-link">Product</NavLink>
          <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
        </div>
      )}

      <div className="nav-right">
        {isLogin ? (
          <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        ) : (
          <div className="nav-links">
            <Link to="/signin" className="btn">Sign In</Link>
            <Link to="/signup" className="btn btn-outline">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
