import { ReactTabulator } from "react-tabulator";
import "tabulator-tables/dist/css/tabulator.min.css"; // Tabulator core styles (v5)
import "tabulator-tables/dist/css/tabulator_midnight.min.css"; // Optional simple theme
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
import katex from "katex";
import "katex/dist/katex.min.css";
import { toScientific } from "../Algorithms/Benchmarks/eval";
console.log(main_data);
const data1 = main_data.functions.filter((item) => item.modality == "unimodal");

const function_columns = [
  {
    title: "Function",
    field: "name",
    resizable: true,
  },
  {
    title: "Dimensionality",
    field: "dimensionality",
    resizable: true,

    formatter: (cell) => {
      const value = cell.getValue();
      let newValue = value.split("-")[0];

      return katex.renderToString(newValue);
    },
  },
  {
    title: "Continuity",
    resizable: true,

    field: "continuity",
    formatter: (cell) => {
      const value = cell.getValue();
      if (value === "continuous") {
        return "<span style='color: #36f75d;'>✓</span>";
      } else if (value === "non-continuous") {
        return "<span style='color: #f75736;'>✗</span>";
      }
    },
  },
  {
    title: "Convexity",
    resizable: true,

    field: "convexity",
    formatter: (cell) => {
      const value = cell.getValue();
      if (value === "convex") {
        return "<span style='color: #36f75d;'>✓</span>";
      } else if (value === "non-convex") {
        return "<span style='color: #f75736;'>✗</span>";
      }
    },
  },
  {
    title: "Differentiability",
    resizable: true,

    field: "differentiability",
    formatter: (cell) => {
      const value = cell.getValue();
      if (value === "differentiable") {
        return "<span style='color: #36f75d;'>✓</span>";
      } else if (value === "non-differentiable") {
        return "<span style='color: #f75736;'>✗</span>";
      }
    },
  },
  {
    title: "Separability",
    field: "separability",
    resizable: true,

    formatter: (cell) => {
      const value = cell.getValue();
      if (value === "separable") {
        return "<span style='color: #36f75d;'>✓</span>";
      } else if (value === "non-separable") {
        return "<span style='color: #f75736;'>✗</span>";
      }
    },
  },
  {
    title: "Input Domain",
    field: "input_domain",
    resizable: true,

    formatter: (cell) => {
      const value = cell.getValue();

      console.log({ value });

      let latex = "";
      if (Array.isArray(value[0])) {
        // 2D array → stringify and remove outer []
        latex = JSON.stringify(value).slice(1, -1);
      } else {
        // 1D array → normal stringify
        latex = JSON.stringify(value);
      }
      console.log({ latex });

      // convert LaTeX to HTML
      const html = katex.renderToString(latex, {
        throwOnError: false,
      });

      // **return HTML string** directly
      return html;
    },
  },
  {
    title: "Global Minimum",
    resizable: true,
    field: "global_minima",
    formatter: (cell) => {
      const value = cell.getValue();
      if (value === "") return "";
      console.log({ value });
      if (isNaN(parseFloat(value)))
        return katex.renderToString(value, { throwOnError: false });
      let val = toScientific(parseFloat(value), 6);
      return katex.renderToString(val, { throwOnError: false });
    },
  },
  {
    resizable: true,

    title: "Minimizer",
    field: "minimizer",
    formatter: (cell) => {
      const value = cell.getValue();
      return katex.renderToString(value, { throwOnError: false });
    },
  },
];

export default function BenchmarkTable() {
  const [table, setTable] = useState(null);

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
      .map((row) => [
        row.name,
        row.dimensionality,
        row.continuity,
        row.convexity,
        row.differentiability,
        row.separability,
        row.input_domain,
        row.global_minima,
        row.minimizer,
      ]);

    // Use autoTable directly
    autoTable(doc, {
      head: [
        [
          "Name",
          "Dimensionality",
          "Continuity",
          "Convexity",
          "Differentiability",
          "Separability",
          "Input Domain",
          "Global Minimum",
          "Minimizer",
        ],
      ],
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
        <h2 className="font-bold text-xl">Unimodal Table</h2>
        <div className="flex gap-1">
          <NavLink
            to="/tables2"
            className="flex items-center gap-1 text-xs cursor-pointer hover:bg-neutral-500 transition duration-200 py-1 rounded-full bg-neutral-800 px-3"
          >
            Next Table <ArrowRight size={16} />
          </NavLink>
        </div>
      </div>
      <div className="px-4">
        <ReactTabulator
          data={data1}
          columns={function_columns}
          layout="fitDataStretch"
          options={{
            pagination: true,
            paginationSize: 20,
            movableColumns: true,
            resizableColumns: true,
          }}
          onRef={(r) => setTable(r)} // capture Tabulator instance here
        />
      </div>
    </div>
  );
}
