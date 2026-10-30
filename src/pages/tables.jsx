import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Check, Download, Minus, Search, X } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { Button, PageShell, SegmentedNav } from "../components/ui";
import { DataTable } from "../components/DataTable";
import { toScientific } from "../Algorithms/Benchmarks/eval";
import functionsRaw from "../Algorithms/Benchmarks/functions.json";
import psoData from "../Algorithms/results/pso.json";
import gaData from "../Algorithms/results/ga.json";

const allFunctions = functionsRaw.functions ?? functionsRaw;

/* --- helpers ------------------------------------------------------------- */

const Tex = ({ children }) => (
  <span
    className="text-[12px]"
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(String(children ?? ""), {
        throwOnError: false,
      }),
    }}
  />
);

/** Tri-state property marker: yes / no / unspecified. */
const Flag = ({ value, yes }) => {
  if (value === yes)
    return <Check size={14} className="text-good" aria-label="yes" />;
  if (value && value !== yes)
    return <X size={14} className="text-bad" aria-label="no" />;
  return <Minus size={13} className="text-ink-faint" aria-label="unspecified" />;
};

const domainText = (value) => {
  if (!Array.isArray(value)) return String(value ?? "—");
  return Array.isArray(value[0])
    ? value.map((pair) => `[${pair.join(", ")}]`).join(" × ")
    : `[${value.join(", ")}]`;
};

const statText = (stat) =>
  stat ? `μ=${toScientific(stat.mean)}, σ²=${toScientific(stat.variance)}` : "—";

const StatCell = ({ stat }) => {
  if (!stat) return <span className="text-ink-faint">—</span>;
  return (
    <span className="font-mono text-[11px] whitespace-nowrap">
      <span className="text-ink">{toScientific(stat.mean)}</span>
      <span className="text-ink-faint"> ± {toScientific(stat.variance)}</span>
    </span>
  );
};

/* --- comparison data ----------------------------------------------------- */

function computeErrorStats(results, globalMin) {
  if (!results || results.length === 0 || globalMin === null) return null;
  const errors = results.map((r) => r - globalMin);
  const mean = errors.reduce((sum, e) => sum + e, 0) / errors.length;
  const variance =
    errors.reduce((sum, e) => sum + (e - mean) ** 2, 0) / errors.length;
  return { mean, variance };
}

const comparisonRows = (() => {
  const psoMap = new Map(psoData.map((item) => [item.algorithm, item]));
  const gaMap = new Map(gaData.map((item) => [item.algorithm, item]));
  const fnMap = new Map(
    allFunctions.map((f) => [f.name.replace(/\s+/g, "").toLowerCase(), f])
  );

  return Array.from(new Set([...psoMap.keys(), ...gaMap.keys()])).map((name) => {
    const pso = psoMap.get(name);
    const ga = gaMap.get(name);
    const info =
      fnMap.get(name.toLowerCase()) ??
      fnMap.get(name.replace(/N\d/, "").toLowerCase()) ??
      null;
    const parsed = info ? parseFloat(info.global_minima) : NaN;
    const globalMin = Number.isFinite(parsed) ? parsed : null;

    return {
      name,
      globalMin,
      pso: pso?.statistics ?? null,
      ga: ga?.statistics ?? null,
      psoError: computeErrorStats(pso?.results, globalMin),
      gaError: computeErrorStats(ga?.results, globalMin),
    };
  });
})();

/* --- column definitions -------------------------------------------------- */

const propertyColumns = [
  {
    key: "name",
    title: "Function",
    nowrap: true,
    render: (r) => <span className="font-medium">{r.name}</span>,
  },
  {
    key: "dimensionality",
    title: "Dim",
    nowrap: true,
    text: (r) => String(r.dimensionality ?? ""),
    sortValue: (r) => parseFloat(r.dimensionality) || Infinity,
    render: (r) => (
      <span className="text-ink-muted">
        {String(r.dimensionality ?? "—").split("-")[0]}
      </span>
    ),
  },
  {
    key: "continuity",
    title: "Cont.",
    render: (r) => <Flag value={r.continuity} yes="continuous" />,
  },
  {
    key: "convexity",
    title: "Convex",
    render: (r) => <Flag value={r.convexity} yes="convex" />,
  },
  {
    key: "differentiability",
    title: "Diff.",
    render: (r) => <Flag value={r.differentiability} yes="differentiable" />,
  },
  {
    key: "separability",
    title: "Sep.",
    render: (r) => <Flag value={r.separability} yes="separable" />,
  },
  {
    key: "input_domain",
    title: "Input domain",
    nowrap: true,
    text: (r) => domainText(r.input_domain),
    render: (r) => (
      <span className="font-mono text-[11px] text-ink-muted">
        {domainText(r.input_domain)}
      </span>
    ),
  },
  {
    key: "global_minima",
    title: "Global minimum",
    nowrap: true,
    text: (r) => String(r.global_minima ?? ""),
    sortValue: (r) => parseFloat(r.global_minima),
    render: (r) => {
      const value = r.global_minima;
      if (value === "" || value == null)
        return <span className="text-ink-faint">—</span>;
      const num = parseFloat(value);
      return <Tex>{Number.isFinite(num) ? toScientific(num) : value}</Tex>;
    },
  },
  {
    key: "minimizer",
    title: "Minimizer",
    nowrap: true,
    text: (r) => String(r.minimizer ?? ""),
    render: (r) =>
      r.minimizer ? (
        <Tex>{r.minimizer}</Tex>
      ) : (
        <span className="text-ink-faint">—</span>
      ),
  },
];

const comparisonColumns = [
  {
    key: "name",
    title: "Function",
    nowrap: true,
    render: (r) => <span className="font-medium">{r.name}</span>,
  },
  {
    key: "globalMin",
    title: "Global min",
    align: "right",
    text: (r) => (r.globalMin != null ? toScientific(r.globalMin) : "—"),
    sortValue: (r) => r.globalMin,
    render: (r) =>
      r.globalMin != null ? (
        toScientific(r.globalMin)
      ) : (
        <span className="text-ink-faint">—</span>
      ),
  },
  {
    key: "pso",
    title: "PSO  f  (μ ± σ²)",
    text: (r) => statText(r.pso),
    sortValue: (r) => r.pso?.mean,
    render: (r) => <StatCell stat={r.pso} />,
  },
  {
    key: "ga",
    title: "GA  f  (μ ± σ²)",
    text: (r) => statText(r.ga),
    sortValue: (r) => r.ga?.mean,
    render: (r) => <StatCell stat={r.ga} />,
  },
  {
    key: "psoError",
    title: "PSO error",
    text: (r) => statText(r.psoError),
    sortValue: (r) => r.psoError?.mean,
    render: (r) => <StatCell stat={r.psoError} />,
  },
  {
    key: "gaError",
    title: "GA error",
    text: (r) => statText(r.gaError),
    sortValue: (r) => r.gaError?.mean,
    render: (r) => <StatCell stat={r.gaError} />,
  },
];

/* --- views --------------------------------------------------------------- */

const VIEWS = {
  unimodal: {
    label: "Unimodal",
    columns: propertyColumns,
    rows: allFunctions.filter((f) => f.modality === "unimodal"),
    file: "benchmarks-unimodal",
  },
  multimodal: {
    label: "Multimodal",
    columns: propertyColumns,
    rows: allFunctions.filter((f) => f.modality === "multimodal"),
    file: "benchmarks-multimodal",
  },
  comparison: {
    label: "GA vs PSO",
    columns: comparisonColumns,
    rows: comparisonRows,
    file: "benchmarks-comparison",
  },
};

/* --- exports ------------------------------------------------------------- */

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportAs(type, { columns, rows, file }) {
  const headers = columns.map((c) => c.title);
  const body = rows.map((row) =>
    columns.map((col) => (col.text ? col.text(row) : String(row[col.key] ?? "")))
  );

  if (type === "csv") {
    const escape = (cell) => `"${String(cell).replace(/"/g, '""')}"`;
    const csv = [headers, ...body].map((r) => r.map(escape).join(",")).join("\n");
    download(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${file}.csv`);
  }

  if (type === "json") {
    const json = body.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
    download(
      new Blob([JSON.stringify(json, null, 2)], { type: "application/json" }),
      `${file}.json`
    );
  }

  if (type === "xlsx") {
    const sheet = XLSX.utils.aoa_to_sheet([headers, ...body]);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Benchmarks");
    XLSX.writeFile(book, `${file}.xlsx`);
  }

  if (type === "pdf") {
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(14);
    doc.text("Benchmarks Report", 14, 15);
    autoTable(doc, {
      head: [headers],
      body,
      startY: 25,
      styles: { fontSize: 7, cellWidth: "auto", overflow: "linebreak" },
      headStyles: { fillColor: [40, 44, 56], textColor: 255, fontStyle: "bold" },
      tableWidth: "auto",
      pageBreak: "auto",
    });
    doc.save(`${file}.pdf`);
  }
}

/* --- page ---------------------------------------------------------------- */

export default function BenchmarkTables() {
  const { view: viewParam } = useParams();
  const view = VIEWS[viewParam] ? viewParam : "unimodal";
  const active = VIEWS[view];

  const [query, setQuery] = useState("");

  // Reset the filter when switching views so a stale query can't make a tab
  // look empty.
  useEffect(() => setQuery(""), [view]);

  const navItems = useMemo(
    () =>
      Object.entries(VIEWS).map(([key, v]) => ({
        to: `/tables/${key}`,
        label: v.label,
      })),
    []
  );

  return (
    <PageShell
      title="Benchmark Results"
      fill
      subtitle={`${active.rows.length} functions`}
      actions={
        <div className="flex items-center gap-2">
          {["csv", "json", "xlsx", "pdf"].map((type) => (
            <Button key={type} size="sm" onClick={() => exportAs(type, active)}>
              <Download size={12} />
              {type.toUpperCase()}
            </Button>
          ))}
        </div>
      }
    >
      <div className="flex h-full flex-col gap-4 p-6">
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <SegmentedNav items={navItems} />

          <div className="relative ml-auto">
            <Search
              size={13}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter functions…"
              className="w-56 rounded-lg border border-line bg-surface-2 py-1.5 pr-3 pl-8 text-[13px] transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <DataTable columns={active.columns} rows={active.rows} query={query} />
      </div>
    </PageShell>
  );
}
