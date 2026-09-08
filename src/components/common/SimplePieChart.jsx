import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PALETTE = [
  "var(--status-assigned)",
  "var(--status-progress)",
  "var(--status-resolved)",
  "var(--status-pending)",
  "var(--status-rejected)",
  "var(--status-closed)",
];

/**
 * Shared donut/pie chart for console dashboards (departments workload share)
 * — library-docs.md § Recharts. `data`: [{ [nameKey]: string, [valueKey]: number }].
 */
export default function SimplePieChart({ data, nameKey, valueKey, height = 220 }) {
  if (!data?.length || data.every((d) => !d[valueKey])) {
    return (
      <div className="flex items-center justify-center text-xs text-ink-muted" style={{ height }}>
        No data available for the selected period.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey={valueKey} nameKey={nameKey} innerRadius="55%" outerRadius="80%" paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry[nameKey]} fill={PALETTE[index % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid var(--console-border)",
            background: "var(--surface)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--ink-muted)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
