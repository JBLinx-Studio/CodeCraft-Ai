
import React from "react";
import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
