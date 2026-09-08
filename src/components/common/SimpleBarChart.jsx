import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Shared bar chart for console dashboards (admin category volume, staff
 * department volume, departments monthly volume) — library-docs.md § Recharts.
 * `data`: [{ [xKey]: string, [yKey]: number }]. Renders the documented
 * "No data available for the selected period." empty state instead of a
 * blank chart when `data` is empty.
 */
export default function SimpleBarChart({ data, xKey, yKey, height = 220, color = "var(--brand)" }) {
  if (!data?.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-xs text-ink-muted" style={{ height }}>
        No data available for the selected period.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--console-border)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "var(--ink-muted)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--ink-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid var(--console-border)",
            background: "var(--surface)",
          }}
        />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
