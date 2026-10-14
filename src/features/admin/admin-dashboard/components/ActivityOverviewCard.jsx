import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, Info, TrendingUp } from "lucide-react";
import { categoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Custom Speech-Bubble Tooltip styled after Reference 1:
 * Dark rounded speech bubble floating above the hovered bar with caret pointer.
 */
function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="relative -translate-y-3 rounded-xl bg-neutral-900 px-3.5 py-2 text-white shadow-xl dark:bg-black border border-white/10 pointer-events-none">
      <p className="text-[11px] font-semibold text-neutral-300">{data.fullMonth ?? label}</p>
      {data.isUpcoming ? (
        <p className="mt-0.5 text-xs text-neutral-400">
          Target Capacity: <span className="font-bold text-white">{data.maxTarget}</span>
        </p>
      ) : (
        <p className="mt-0.5 font-mono text-xs font-bold text-white">
          {data.resolved} / {data.total}{" "}
          <span className="text-[11px] font-normal text-neutral-400">resolved</span>
        </p>
      )}
      {/* Downward triangle caret */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45 bg-neutral-900 border-r border-b border-white/10 dark:bg-black" />
    </div>
  );
}

/**
 * Custom X-Axis Tick styled after Reference 2:
 * Active current month (Oct) gets a pill badge highlight.
 */
function CustomXAxisTick({ x, y, payload }) {
  const isCurrent = payload.value === "Oct";
  return (
    <g transform={`translate(${x},${y})`}>
      {isCurrent ? (
        <>
          <rect
            x={-15}
            y={6}
            width={30}
            height={19}
            rx={9.5}
            fill="var(--brand)"
            fillOpacity={0.15}
            stroke="var(--brand)"
            strokeWidth={1}
          />
          <text
            x={0}
            y={19}
            textAnchor="middle"
            fill="var(--brand)"
            fontSize={10.5}
            fontWeight={700}
          >
            {payload.value}
          </text>
        </>
      ) : (
        <text
          x={0}
          y={19}
          textAnchor="middle"
          fill="var(--ink-muted)"
          fontSize={10.5}
          fontWeight={500}
        >
          {payload.value}
        </text>
      )}
    </g>
  );
}

/**
 * Executive Activity & Resolution Overview Card.
 * Modeled after modern executive dashboards with capsule bars, background tracks,
 * top-right [Monthly | By Category] tab switcher, and clean 2026 year dropdown beside title.
 */
export default function ActivityOverviewCard({ monthlyTrends, categoryVolume = [] }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("monthly"); // 'monthly' | 'categories'
  const [selectedYear, setSelectedYear] = useState(monthlyTrends?.year ?? 2026);
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);

  const trends = monthlyTrends ?? {
    year: 2026,
    yearLabel: "2026",
    series: [
      { month: "Jan", fullMonth: "January 2026", total: 15, resolved: 13, maxTarget: 35 },
      { month: "Feb", fullMonth: "February 2026", total: 18, resolved: 15, maxTarget: 35 },
      { month: "Mar", fullMonth: "March 2026", total: 22, resolved: 19, maxTarget: 35 },
      { month: "Apr", fullMonth: "April 2026", total: 25, resolved: 22, maxTarget: 35 },
      { month: "May", fullMonth: "May 2026", total: 28, resolved: 24, maxTarget: 35 },
      { month: "Jun", fullMonth: "June 2026", total: 24, resolved: 21, maxTarget: 35 },
      { month: "Jul", fullMonth: "July 2026", total: 29, resolved: 26, maxTarget: 35 },
      { month: "Aug", fullMonth: "August 2026", total: 33, resolved: 29, maxTarget: 35 },
      { month: "Sep", fullMonth: "September 2026", total: 27, resolved: 24, maxTarget: 35 },
      { month: "Oct", fullMonth: "October 2026 (Current)", total: 32, resolved: 28, maxTarget: 35, isCurrent: true },
      { month: "Nov", fullMonth: "November 2026 (Upcoming)", total: 0, resolved: 0, maxTarget: 35, isUpcoming: true },
      { month: "Dec", fullMonth: "December 2026 (Upcoming)", total: 0, resolved: 0, maxTarget: 35, isUpcoming: true },
    ],
    avgMonthlyIntake: 25.1,
    overallResolutionRate: 86.2,
    growthRate: "+18.4%",
  };

  const sortedCategories = [...categoryVolume].sort((a, b) => b.reportCount - a.reportCount);
  const totalCategoryReports = sortedCategories.reduce((acc, c) => acc + (c.reportCount || 0), 0) || 1;
  const topCategory = sortedCategories[0] ?? { categoryName: "Potholes / Roads", reportCount: 5 };

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Top Header: Title + 2026 Dropdown on Left, Tab Switcher in Top Right Corner */}
      <div className="p-5 pb-1">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Card Title + Year Dropdown beside it */}
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-display text-sm font-semibold tracking-tight text-ink truncate">
              {t("Activity & Resolution Overview")}
            </h2>

            {/* Clean Dropdown beside the title */}
            <div className="relative inline-flex">
              <button
                type="button"
                onClick={() => setIsYearMenuOpen(!isYearMenuOpen)}
                className="inline-flex items-center gap-1 rounded-md border border-console-border bg-surface px-2 py-0.5 text-xs font-semibold text-ink shadow-xs hover:bg-surface-muted transition-colors"
                title={t("Select fiscal year")}
              >
                <span>{selectedYear}</span>
                <ChevronDown className="size-3 text-ink-muted" />
              </button>

              {isYearMenuOpen && (
                <div className="absolute left-0 top-full mt-1 z-30 w-24 rounded-lg border border-console-border bg-surface py-1 shadow-lg">
                  {[2026, 2025, 2024].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setSelectedYear(yr);
                        setIsYearMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1 text-left text-xs transition-colors hover:bg-surface-muted",
                        selectedYear === yr ? "font-bold text-brand" : "text-ink"
                      )}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: [ Monthly | By Category ] Tab Switcher flush in top right corner */}
          <div className="flex items-center rounded-lg border border-console-border bg-surface-muted/50 p-0.5 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("monthly")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-all",
                activeTab === "monthly"
                  ? "bg-surface font-semibold text-ink shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {t("Monthly")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-all",
                activeTab === "categories"
                  ? "bg-surface font-semibold text-ink shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {t("By Category")}
            </button>
          </div>
        </div>

        {/* Hero Stat & Trend Pill (Lifted close to the chart) */}
        <div className="mt-3 flex items-baseline gap-3">
          <div>
            <span className="block text-xs font-medium text-ink-muted">
              {activeTab === "monthly" ? t("Avg Intake Per Month") : t("Top Impact Category")}
            </span>
            <div className="mt-0.5 flex items-baseline gap-2.5">
              <span className="font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
                {activeTab === "monthly"
                  ? `${trends.avgMonthlyIntake} ${t("Reports/mo")}`
                  : topCategory.categoryName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="size-3" />
                {activeTab === "monthly"
                  ? trends.growthRate
                  : `${Math.round((topCategory.reportCount / totalCategoryReports) * 100)}% load`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Content Area — Centered vertically within the card */}
      <div className="flex-1 px-4 py-3 min-h-[250px] flex flex-col justify-center">
        {activeTab === "monthly" ? (
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={trends.series}
              margin={{ top: 10, right: 10, left: -26, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--console-border)"
                strokeOpacity={0.6}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={<CustomXAxisTick />}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--ink-muted)" }}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomChartTooltip />}
                cursor={{ fill: "var(--surface-muted)", opacity: 0.4 }}
              />
              {/* Capsule Bars with Background Tracks (Ref 1 & 2) */}
              <Bar
                dataKey="resolved"
                radius={[5, 5, 5, 5]}
                barSize={18}
                background={{ fill: "var(--surface-muted)", radius: [5, 5, 5, 5] }}
              >
                {trends.series.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill="var(--brand)"
                    fillOpacity={entry.isUpcoming ? 0 : entry.isCurrent ? 1 : 0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          /* Category Breakdown View — Centered vertically within the card */
          <div className="flex flex-col gap-3 py-2 justify-center">
            {sortedCategories.slice(0, 6).map((cat) => {
              const CatIcon = categoryIcon(cat);
              const pct = Math.round((cat.reportCount / totalCategoryReports) * 100);

              return (
                <div key={cat.categoryId ?? cat.categoryName} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-ink truncate">
                      <CatIcon className="size-3.5 shrink-0" style={{ color: cat.colorHex ?? undefined }} />
                      {cat.categoryName}
                    </span>
                    <span className="font-mono text-ink-muted shrink-0 tabular-nums font-semibold">
                      {cat.reportCount} ({pct}%)
                    </span>
                  </div>
                  {/* Capsule Progress Track */}
                  <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(6, pct)}%`,
                        backgroundColor: cat.colorHex || "var(--brand)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dedicated Goal & Benchmark Strip Attached at Bottom (Ref 2) */}
      <div className="flex items-center justify-between border-t border-console-border/70 bg-surface-muted/30 px-5 py-3 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5">
          <Info className="size-3.5 text-ink-muted/70" />
          <span className="font-medium text-ink">
            {activeTab === "monthly"
              ? t("Municipal Resolution Target")
              : t("Infrastructure Service Categories")}
          </span>
        </div>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
          {activeTab === "monthly"
            ? t("+{rate}% of annual target resolved", { rate: `${trends.overallResolutionRate}` })
            : t("{count} active categories monitored", { count: `${sortedCategories.length}` })}
        </span>
      </div>
    </div>
  );
}
