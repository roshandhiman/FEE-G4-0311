import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Background from "./Background.jsx";
import { StudentsApp } from "./App.jsx";
import AddStudent from "./AddStudent.jsx";
import Logout from "./Logout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/" element={<StudentsApp />} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);