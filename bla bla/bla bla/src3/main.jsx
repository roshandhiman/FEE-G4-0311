import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Background from "./Background.jsx";
import App from "./App.jsx";
import { UpdateForm } from "./UpdateForm.jsx";
import AddStudent from "./AddStudent.jsx";
import Login from "./Login.jsx";
import Logout from "./Logout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="/students" element={<App />} />
        <Route path="/update/:id" element={<UpdateForm />} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/students" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
