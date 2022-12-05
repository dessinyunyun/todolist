import React from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbarcomponents";
import ActivityDetail from "./pages/ActivityDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activity/:id" element={<ActivityDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
