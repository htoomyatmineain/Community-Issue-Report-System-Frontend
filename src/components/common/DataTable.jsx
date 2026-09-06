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
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          {columns.map((col) => (
            <th key={col.key} className="px-3 py-2 font-medium">
              {t(col.header)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id ?? i} className="border-b last:border-0">
            {columns.map((col) => (
              <td key={col.key} className="px-3 py-2">
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
