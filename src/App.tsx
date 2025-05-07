
import React from "react";
import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <div className="bg-circles-pattern min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
