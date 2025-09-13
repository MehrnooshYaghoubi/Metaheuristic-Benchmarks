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
import pso_data from "./../Algorithms/results/pso.json";
import ga_data from "./../Algorithms/results/ga.json";
import { toScientific } from "../Algorithms/Benchmarks/eval";
import functionsInfoRaw from "./../Algorithms/Benchmarks/functions.json";
window.XLSX = XLSX;
window.jspdf = window.jspdf || {};
window.jspdf.jsPDF = jsPDF;
const functionsInfo = functionsInfoRaw.functions || functionsInfoRaw;
function computeErrorStats(results, globalMin) {
  if (!results || results.length === 0) return null;

  const errors = results.map((r) => r - globalMin);
  const mean = errors.reduce((sum, e) => sum + e, 0) / errors.length;
  const variance =
    errors.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / errors.length;

  return { mean, variance };
}

function mergeResults(psoJson, gaJson, functionsInfo) {
  // quick lookup maps
  const psoMap = new Map(psoJson.map((item) => [item.algorithm, item]));
  const gaMap = new Map(gaJson.map((item) => [item.algorithm, item]));
  const fnMap = new Map(
    functionsInfo.map((f) => [f.name.replace(/\s+/g, "").toLowerCase(), f])
  );

  const allAlgorithms = new Set([...psoMap.keys(), ...gaMap.keys()]);

  return Array.from(allAlgorithms).map((name) => {
    const pso = psoMap.get(name);
    const ga = gaMap.get(name);

    // match function info (case-insensitive)
    console.log({ name });
    const funcInfo =
      fnMap.get(name.toLowerCase()) ||
      fnMap.get(name.replace(/N\d/, "").toLowerCase()) ||
      null;

    // safe access
    const globalMin = funcInfo ? parseFloat(funcInfo.global_minima) : null;

    console.log(funcInfo ? funcInfo.global_minima : "no match", globalMin);

    return {
      name,
      globalMin,
      pso: pso ? pso.statistics : null,
      ga: ga ? ga.statistics : null,
      psoError: pso ? computeErrorStats(pso.results, globalMin) : null,
      gaError: ga ? computeErrorStats(ga.results, globalMin) : null,
    };
  });
}

const main_data = mergeResults(pso_data, ga_data, functionsInfo);

const function_columns = [
  {
    title: "Function",
    field: "name",
  },
  {
    title: "Global Min",
    field: "globalMin",
  },
  {
    title: "PSO (f)",
    field: "pso",
    formatter: (cell) => {
      const val = cell.getValue();
      if (!val) return "-";
      return `μ=${toScientific(val.mean, 6)}, σ²=${toScientific(
        val.variance,
        6
      )}`;
    },
  },
  {
    title: "GA (f)",
    field: "ga",
    formatter: (cell) => {
      const val = cell.getValue();
      if (!val) return "-";
      return `μ=${toScientific(val.mean, 6)}, σ²=${toScientific(
        val.variance,
        6
      )}`;
    },
  },
  {
    title: "PSO (error)",
    field: "psoError",
    formatter: (cell) => {
      const val = cell.getValue();
      if (!val) return "-";
      return `μ=${toScientific(val.mean, 6)}, σ²=${toScientific(
        val.variance,
        6
      )}`;
    },
  },
  {
    title: "GA (error)",
    field: "gaError",
    formatter: (cell) => {
      const val = cell.getValue();
      if (!val) return "-";
      return `μ=${toScientific(val.mean, 6)}, σ²=${toScientific(
        val.variance,
        6
      )}`;
    },
  },
];

export default function BenchmarkTable3() {
  const [table, setTable] = useState(null);
  const [page, setPage] = useState(1);

  // Build export rows consistently (for PDF, CSV, JSON, XLSX)
  const buildExportRows = () => {
    return table.current
      .getData()
      .map((row) => [
        row.name ?? "-",
        row.globalMin != null ? toScientific(row.globalMin) : "-",
        safeFormat(row.pso),
        safeFormat(row.ga),
        safeFormat(row.psoError),
        safeFormat(row.gaError),
      ]);
  };

  // Headers (same for all exports)
  const exportHeaders = [
    "Function",
    "Global Min",
    "PSO (f)",
    "GA (f)",
    "PSO (error)",
    "GA (error)",
  ];

  // CSV / JSON / XLSX
  const handleExport = (type) => {
    if (!table) {
      console.warn("Table not ready yet");
      return;
    }

    const rows = buildExportRows();

    if (type === "csv") {
      const csv = [
        exportHeaders.join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "benchmarks.csv";
      link.click();
    }

    if (type === "json") {
      const json = rows.map((r) =>
        Object.fromEntries(exportHeaders.map((h, i) => [h, r[i]]))
      );
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "benchmarks.json";
      link.click();
    }

    if (type === "xlsx") {
      const worksheet = XLSX.utils.aoa_to_sheet([exportHeaders, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Benchmarks");
      XLSX.writeFile(workbook, "benchmarks.xlsx");
    }
  };

  // Use scientific notation everywhere
  const safeFormat = (val) => {
    if (!val) return "-";
    return `mean: ${toScientific(val.mean)}, variance: ${toScientific(
      val.variance
    )}`;
  };

  const handleExportPDF = () => {
    // Use landscape so 6 columns fit nicely
    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(14);
    doc.text("Benchmarks Report", 14, 15);

    const rows = table.current
      .getData()
      .map((row) => [
        row.name ?? "-",
        row.globalMin != null ? toScientific(row.globalMin) : "-",
        safeFormat(row.pso),
        safeFormat(row.ga),
        safeFormat(row.psoError),
        safeFormat(row.gaError),
      ]);

    autoTable(doc, {
      head: [
        [
          "Function",
          "Global Min",
          "PSO (f)",
          "GA (f)",
          "PSO (error)",
          "GA (error)",
        ],
      ],
      body: rows,
      startY: 25,
      styles: {
        fontSize: 7,
        cellWidth: "auto",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: 255,
        fontStyle: "bold",
      },
      tableWidth: "auto",
      pageBreak: "auto",
    });

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
          data={main_data}
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
