import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import KineticGrid from "./KineticGrid";
function Home() {
    return <h1>Home Page</h1>;
}
function SignInForm({ setLogin }) {
    const navigate = useNavigate();
    function handleLogin() {
        setLogin(true);
        navigate("/page1");
    }
    return <div><h1>Sign In</h1><button onClick={handleLogin}>Login</button></div>;
}
function SignUp() {
    return <h1>Sign Up Page</h1>;
}
function Page1() {
    return <h1>Page 1</h1>;
}
function Page2() {
    return <h1>Page 2</h1>;
}
function Page3() {
    return <h1>404: Page Not Found</h1>;
}
function ProtectedRoute({ isLogin, children }) {
    return isLogin ? children : <Navigate to="/signin" replace />;
}
export default function App() {
    const [isLogin, setLogin] = useState(false);
    return (
        <BrowserRouter>
            <KineticGrid>
                <NavBar isLogin={isLogin} setLogin={setLogin} />
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignInForm setLogin={setLogin} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/page1" element={<ProtectedRoute isLogin={isLogin}><Page1 /></ProtectedRoute>} />
                <Route path="/page2" element={<ProtectedRoute isLogin={isLogin}><Page2 /></ProtectedRoute>} />
                <Route path="/page3" element={<ProtectedRoute isLogin={isLogin}><Page3 /></ProtectedRoute>} />
                </Routes>
            </KineticGrid>
        </BrowserRouter>
    );
}
