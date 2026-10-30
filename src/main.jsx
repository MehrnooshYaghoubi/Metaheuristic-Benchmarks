import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import App from "./App";
import "./index.css";
import GeneticAlgorithm from "./pages/ga";
import PSO from "./pages/pso";
import BenchmarkTables from "./pages/tables";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ga" element={<GeneticAlgorithm />} />
        <Route path="/pso" element={<PSO />} />
        {/* The three former table pages are now views of one route. */}
        <Route path="/tables" element={<Navigate to="/tables/unimodal" replace />} />
        <Route path="/tables/:view" element={<BenchmarkTables />} />
        <Route path="/tables2" element={<Navigate to="/tables/multimodal" replace />} />
        <Route path="/tables3" element={<Navigate to="/tables/comparison" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
