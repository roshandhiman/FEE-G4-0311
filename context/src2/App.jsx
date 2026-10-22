import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BackgroundVideo from "./components/BackgroundVideo";
import SplashCursor from "./components/SplashCursor";

function Home() {
  return (
    <div className="page-container">
      <h1 className="page-title">Home Page</h1>
    </div>
  );
}

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login();
    navigate("/");
  }

  return (
    <div className="page-container center-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Sign In</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">Sign In</button>
      </form>
    </div>
  );
}

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login();
    navigate("/");
  }

  return (
    <div className="page-container center-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Sign Up</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">Sign Up</button>
      </form>
    </div>
  );
}

function About() {
  return (
    <div className="page-container">
      <h1 className="page-title">About Us</h1>
    </div>
  );
}

function Product() {
  return (
    <div className="page-container">
      <h1 className="page-title">Product</h1>
    </div>
  );
}

function Contact() {
  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>
    </div>
  );
}

function NotFound() {
  return (
    <div className="page-container">
      <h1 className="page-title">Page Not Found</h1>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isLogin } = useAuth();
  return isLogin ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SplashCursor
          rainbow
          size={1}
          force={1}
          swirl={3}
          trail={1}
          clickSplash
        />
        <BackgroundVideo />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
