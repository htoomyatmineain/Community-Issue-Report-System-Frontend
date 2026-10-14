import { useState } from "react";
import { TrendingUp, BarChart2 } from "lucide-react";
import SimpleBarChart from "@/components/common/SimpleBarChart";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Department operational trends card with monthly volume bar chart in brand blue.
 */
export default function StaffTrendsCard({ monthlySeries = [] }) {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState(2026);

  // Normalize month names and ensure both `count` and `reportCount` are mapped
  const formattedSeries = (monthlySeries || []).map((m) => {
    const val = Number(m.count ?? m.reportCount ?? 0);
    let monthLabel = m.month;
    if (typeof m.month === "string" && m.month.includes("-")) {
      const parts = m.month.split("-");
      const monthNum = parseInt(parts[1], 10);
      const date = new Date(2026, monthNum - 1, 1);
      if (!isNaN(date.getTime())) {
        monthLabel = date.toLocaleString(undefined, { month: "short" });
      }
    }
    return {
      ...m,
      month: monthLabel,
      reportCount: val,
      count: val,
    };
  });

  const totalReports = formattedSeries.reduce((acc, m) => acc + m.reportCount, 0);
  const activeMonths = formattedSeries.filter((m) => m.reportCount > 0).length || formattedSeries.length || 1;
  const avgMonthly = Math.max(1, Math.round(totalReports / activeMonths));

  return (
    <div className="flex flex-col rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-sm font-semibold tracking-tight text-ink">
              {t("Department Activity & Resolution Trends")}
            </h2>
            <span className="rounded-md border border-console-border bg-surface-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink">
              {selectedYear}
            </span>
          </div>

          <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand border border-brand/20">
            {t("Volume History")}
          </span>
        </div>

        {/* Hero Stat */}
        <div className="mt-3 flex items-baseline gap-3">
          <div>
            <span className="block text-xs font-medium text-ink-muted">
              {t("Avg Monthly Intake & Dispatch")}
            </span>
            <div className="mt-0.5 flex items-baseline gap-2.5">
              <span className="font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
                {avgMonthly} {t("Reports/mo")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="size-3" />
                {t("+12% throughput")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Content Area — Vertically Centered */}
      <div className="flex-1 px-4 py-3 min-h-[250px] flex flex-col justify-center">
        <SimpleBarChart
          data={formattedSeries}
          xKey="month"
          yKey="reportCount"
          height={260}
          color="rgba(35, 127, 234, 0.78)"
        />
      </div>
    </div>
  );
}
