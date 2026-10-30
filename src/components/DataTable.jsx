import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

/**
 * A small sortable table.
 *
 * Columns are declared as:
 *   { key, title, align?, width?, render?(row), text?(row), sortValue?(row) }
 *
 * `text` is what exports emit and what the search box matches, so the exported
 * file always says the same thing the screen does. `render` is display-only.
 */
export function DataTable({ columns, rows, query = "" }) {
  const [sort, setSort] = useState({ key: null, dir: 1 });

  const textOf = (col, row) =>
    col.text ? col.text(row) : String(row[col.key] ?? "");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = q
      ? rows.filter((row) =>
          columns.some((col) => textOf(col, row).toLowerCase().includes(q))
        )
      : rows;

    if (sort.key) {
      const col = columns.find((c) => c.key === sort.key);
      const value = (row) =>
        col.sortValue ? col.sortValue(row) : textOf(col, row);
      out = [...out].sort((a, b) => {
        const va = value(a);
        const vb = value(b);
        // Missing values always sort last, regardless of direction.
        const na = va === null || va === undefined || Number.isNaN(va);
        const nb = vb === null || vb === undefined || Number.isNaN(vb);
        if (na || nb) return na && nb ? 0 : na ? 1 : -1;
        if (typeof va === "number" && typeof vb === "number")
          return (va - vb) * sort.dir;
        return String(va).localeCompare(String(vb)) * sort.dir;
      });
    }
    return out;
  }, [rows, columns, query, sort]);

  const toggle = (key) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-line bg-surface">
      {/* The table scrolls inside this box rather than pushing the page wide. */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 bg-surface-2">
            <tr>
              {columns.map((col) => {
                const active = sort.key === col.key;
                const Icon = !active
                  ? ChevronsUpDown
                  : sort.dir === 1
                    ? ArrowUp
                    : ArrowDown;
                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={`border-b border-line px-3 py-2.5 font-medium whitespace-nowrap ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    <button
                      onClick={() => toggle(col.key)}
                      className={`group inline-flex items-center gap-1.5 transition-colors ${
                        active ? "text-ink" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {col.title}
                      <Icon
                        size={12}
                        className={
                          active
                            ? "text-accent"
                            : "text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
                        }
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr
                key={row.name ?? i}
                className="border-b border-line/60 last:border-0 hover:bg-surface-2"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2 align-middle ${
                      col.align === "right"
                        ? "text-right font-mono text-[12px]"
                        : "text-left"
                    } ${col.nowrap ? "whitespace-nowrap" : ""}`}
                  >
                    {col.render ? col.render(row) : (row[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-10 text-center text-ink-faint"
                >
                  Nothing matches “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="shrink-0 border-t border-line px-3 py-2 text-[11px] text-ink-faint">
        {visible.length} of {rows.length} functions
      </div>
    </div>
  );
}
