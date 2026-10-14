import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Shared bar chart for console dashboards (admin category volume, staff
 * department volume, departments monthly volume) — library-docs.md § Recharts.
 *
 * @param {Array} data - Array of chart records [{ [xKey]: string, [yKey]: number }]
 * @param {string} xKey - Key for X-axis labels
 * @param {string} yKey - Key for Y-axis numeric values
 * @param {number} height - Total container height in px
 * @param {string} color - Bar fill color
 * @param {boolean} tiltX - When true, angles X-axis labels at -35° with interval=0 so no labels are dropped
 */
export default function SimpleBarChart({
  data,
  xKey,
  yKey,
  height = 220,
  color = "var(--brand)",
  tiltX = false,
}) {
  if (!data?.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-xs text-ink-muted" style={{ height }}>
        No data available for the selected period.
      </div>
    );
  }

  const margin = tiltX
    ? { top: 12, right: 12, left: -16, bottom: 60 }
    : { top: 8, right: 8, left: -16, bottom: 0 };

  return (
    <div className="w-full flex-1 flex flex-col justify-center">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--console-border)" />
          <XAxis
            dataKey={xKey}
            interval={tiltX ? 0 : "preserveEnd"}
            angle={tiltX ? -35 : 0}
            textAnchor={tiltX ? "end" : "middle"}
            height={tiltX ? 75 : 30}
            tickFormatter={
              tiltX
                ? (val) => (typeof val === "string" && val.length > 22 ? `${val.slice(0, 20)}…` : val)
                : undefined
            }
            tick={{ fontSize: 11, fill: "var(--ink-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--ink-muted)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid var(--console-border)",
              background: "var(--surface)",
              color: "var(--ink)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            labelStyle={{ fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}
            formatter={(value) => [value, "Reports"]}
          />
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
