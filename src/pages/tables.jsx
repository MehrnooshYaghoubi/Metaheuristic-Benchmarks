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

window.XLSX = XLSX;
window.jspdf = window.jspdf || {};
window.jspdf.jsPDF = jsPDF;

const columns = [
  { title: "Function", field: "name" },
  { title: "Mean", field: "mean", hozAlign: "right" },
  { title: "Variance", field: "variance", hozAlign: "right" },
];

export default function BenchmarkTable() {
  const [table, setTable] = useState(null);
  const [page, setPage] = useState(2);
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

  const onNextPage = () => {
    if (page === 3) {
      setPage(1);
    } else {
      setPage(page + 1);
    }
  };

  const onPrevPage = () => {
    if (page === 1) {
      setPage(3);
    } else {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (!table) return;

    const data = [
      { name: "bohachevskyN1", mean: 0, variance: 0 },
      { name: "ackleyN2", mean: -200, variance: 0 },
      {
        name: "sphere",
        mean: 4.5191050841191775e-7,
        variance: 6.111009957269615e-13,
      },
      { name: "brent", mean: 8.194012623990515e-40, variance: 0 },
      {
        name: "dropWave",
        mean: -1.491605138450382,
        variance: 2.465190328815662e-33,
      },
      {
        name: "matyas",
        mean: 2.5136364148305196e-35,
        variance: 2.587523788661508e-69,
      },
      {
        name: "schwefel220",
        mean: 5.200190352866245,
        variance: 53.438099406024186,
      },
      {
        name: "bird",
        mean: -106.76453674926479,
        variance: 5.9574775562290815e-28,
      },
      { name: "deckkersAarts", mean: -8000029390, variance: 0 },
      {
        name: "goldsteinPrice",
        mean: -1939996788.1207738,
        variance: 1.6768808563938365e-13,
      },
      {
        name: "happyCat",
        mean: 0.9579645120614222,
        variance: 1.3418312846802967,
      },
      { name: "leviN13", mean: 1.3497838043956716e-31, variance: 0 },
      {
        name: "salomon",
        mean: 0.5348748819630094,
        variance: 0.06227463469276303,
      },
      { name: "wolfe", mean: -10, variance: 0 },
    ];
    // update data depending on page
    if (page === 1) table.current.replaceData(data);
    if (page === 2) table.current.replaceData(data);
    if (page === 3) table.current.replaceData(data);
  }, [page, table]);

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
        <h2 className="font-bold text-xl">
          {page === 1 && "Unimodal Table"}
          {page === 2 && "Multimodal Table"}
          {page === 3 && "Comparison Table"}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={onPrevPage}
            style={{ display: page === 1 ? "none" : "inline-flex" }}
            className="flex items-center gap-1 text-xs cursor-pointer hover:bg-neutral-500 transition duration-200 py-1 rounded-full bg-neutral-800 px-3"
          >
            <ArrowLeft size={16} />
            Previous Table
          </button>{" "}
          <button
            onClick={onNextPage}
            style={{ display: page === 3 ? "none" : "inline-flex" }}
            className="flex items-center gap-1 text-xs cursor-pointer hover:bg-neutral-500 transition duration-200 py-1 rounded-full bg-neutral-800 px-3"
          >
            Next Table <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="px-4">
        <ReactTabulator
          data={data}
          columns={columns}
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
