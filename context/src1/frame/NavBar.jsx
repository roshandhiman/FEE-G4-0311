import { Link, useNavigate } from "react-router-dom";
export default function NavBar({ isLogin, setLogin }) {
    const navigate = useNavigate();
    function handleLogout() {
        setLogin(false);
        navigate("/");
    }
    return (
        <nav className="navbar">
            {isLogin && (
                <div className="nav-center">
                    <Link to="/page1" className="nav-link">Page 1</Link>
                    <Link to="/page2" className="nav-link">Page 2</Link>
                    <Link to="/page3" className="nav-link">Page 3</Link>
                </div>
            )}
            <Link to="/" className="nav-link">Home</Link>
            {isLogin && (
                <button onClick={handleLogout} className="auth-btn">Logout</button>
            )}
            {!isLogin && (
                <div className="nav-links">
                    <Link to="/signin" className="auth-btn">Sign In</Link>
                    <Link to="/signup" className="auth-btn">Sign Up</Link>
                </div>
            )}
        </nav>
    );
}
