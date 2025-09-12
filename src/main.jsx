import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import "./index.css";
import GeneticAlgorithm from "./pages/ga";
import PSO from "./pages/pso";
import BenchmarkTable from "./pages/tables";
import BenchmarkTable2 from "./pages/tables2";
import BenchmarkTable3 from "./pages/tables3";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/ga" element={<GeneticAlgorithm />} />
      <Route path="/pso" element={<PSO />} />
      <Route path="/tables" element={<BenchmarkTable />} />
      <Route path="/tables2" element={<BenchmarkTable2 />} />
      <Route path="/tables3" element={<BenchmarkTable3 />} />
    </Routes>
  </BrowserRouter>
);
