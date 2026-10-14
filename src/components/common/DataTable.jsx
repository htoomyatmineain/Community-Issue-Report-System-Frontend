import EmptyState from "./EmptyState";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Minimal generic table. `columns`: [{ key, header, render? }], `rows`: object[].
 * Swap for a TanStack Table wrapper once sorting/pagination are needed.
 */
export default function DataTable({ columns, rows, emptyLabel = "No records" }) {
  const { t } = useLanguage();
  if (!rows?.length) return <EmptyState title={emptyLabel} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-console-border/70 bg-surface-muted/40">
            {columns.map((col) => (
              <th
                key={col.key}
                className="h-10 px-4 text-[11px] font-semibold uppercase tracking-wider text-ink-muted/80 select-none"
              >
                {t(col.header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-console-border/60">
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="transition-colors duration-150 hover:bg-surface-muted/40"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[13px] text-ink">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
