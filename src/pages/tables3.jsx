import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css"; // default Tabulator theme
import "react-tabulator/css/tabulator_midnight.min.css"; // optional dark theme
import Header from "../titlebar";
import "./table_style.css";
import { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { data, NavLink } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import main_data from "./../Algorithms/Benchmarks/functions.json";
window.XLSX = XLSX;
window.jspdf = window.jspdf || {};
window.jspdf.jsPDF = jsPDF;

console.log(main_data);
const data1 = main_data.functions.filter((item) => item.modality == "unimodal");
const data2 = main_data.functions.filter(
  (item) => item.modality == "multimodal"
);

const function_columns = [
  {
    title: "Function",
    field: "name",
  },
  { title: "Dimensionality", field: "dimensionality" },
  { title: "Continuity", field: "continuity" },
  { title: "Convexity", field: "convexity" },
  { title: "Differentiability", field: "differentiability" },
  { title: "Separability", field: "separability" },
  { title: "Input Domain", field: "input_domain" },
  { title: "Global Minimum", field: "global_minimum" },
  { title: "Minimizer", field: "minimizer" },
];

export default function BenchmarkTable3() {
  const [table, setTable] = useState(null);
  const [page, setPage] = useState(1);

  const handleExport = (type) => {
    if (!table) {
      console.warn("Table not ready yet");
      return;
    }

    console.log({ table });

    if (type === "csv") table.current.download("csv", "benchmarks.csv");
    if (type === "json") table.current.download("json", "benchmarks.json");
    if (type === "xlsx")
      table.current.download("xlsx", "benchmarks.xlsx", {
        sheetName: "Benchmarks",
      });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Benchmarks Report", 14, 10);

    // Convert Tabulator data → rows
    const rows = table.current
      .getData()
      .map((row) => [row.name, row.mean, row.variance]);

    // Use autoTable directly
    autoTable(doc, {
      head: [["Name", "Mean", "Variance"]],
      body: rows,
    });

    // Save file
    doc.save("benchmarks.pdf");
  };

  return (
    <div>
      <Header />
      <div className="mb-2 flex px-4 pt-2">
        <NavLink to={"/"} className="flex items-center gap-1 mr-2 text-xs">
          <ArrowLeft size={13} /> Home
        </NavLink>
        <button
          className="bg-neutral-800 text-white px-2 rounded-l-2xl text-xs py-1 cursor-pointer hover:bg-white/40 transition-colors duration-300 pl-4"
          onClick={() => handleExport("csv")}
        >
          Export CSV
        </button>
        <button
          className="bg-neutral-800 text-white px-2  text-xs cursor-pointer hover:bg-white/40 transition-colors duration-300"
          onClick={() => handleExport("json")}
        >
          Export JSON
        </button>
        <button
          className="bg-neutral-800 text-white px-2  text-xs cursor-pointer hover:bg-white/40 transition-colors duration-300"
          onClick={() => handleExport("xlsx")}
        >
          Export XLSX
        </button>
        <button
          className="bg-neutral-800 text-white px-2 rounded-r-2xl text-xs cursor-pointer hover:bg-white/40 transition-colors duration-300 pr-4"
          onClick={() => handleExportPDF()}
        >
          Export PDF
        </button>
      </div>
      <div className="px-4 my-4 flex items-center justify-between  gap-4">
        <h2 className="font-bold text-xl">Comparison Table</h2>
        <div className="flex gap-1">
          <NavLink
            to={"/tables2"}
            className="flex items-center gap-1 text-xs cursor-pointer hover:bg-neutral-500 transition duration-200 py-1 rounded-full bg-neutral-800 px-3"
          >
            <ArrowLeft size={16} />
            Previous Table
          </NavLink>
        </div>
      </div>
      <div className="px-4">
        <ReactTabulator
          data={data1}
          columns={function_columns}
          layout="fitColumns"
          options={{
            pagination: "true",
            paginationSize: 20,
            moveableColumns: true,
          }}
          onRef={(r) => setTable(r)} // capture Tabulator instance here
        />
      </div>
    </div>
  );
}
