import { Link } from "react-router-dom";
import { Layers, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Department Workload & Category Capacity Balance Panel.
 * Shows operational category distribution and workload percentages for staff.
 */
export default function StaffWorkloadPanel({ categoryBreakdown = [], totalActive = 0 }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight text-ink">
            {t("Department Category Workload")}
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            {t("Active ticket distribution and volume breakdown across municipal categories")}
          </p>
        </div>
        <Link
          to="/staff/reports"
          className="text-xs font-medium text-brand hover:underline shrink-0"
        >
          {t("View all reports")}
        </Link>
      </div>

      <div className="mt-4 flex-1 flex flex-col justify-center divide-y divide-console-border/40">
        {categoryBreakdown.length === 0 ? (
          <p className="py-6 text-center text-xs text-ink-muted">{t("No active category metrics available.")}</p>
        ) : (
          <div className="space-y-4 py-2">
            {categoryBreakdown.slice(0, 6).map((cat) => (
              <div key={cat.name} className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-2 rounded-full bg-brand" />
                    <span className="font-medium text-ink truncate">{cat.name}</span>
                  </div>
                  <span className="font-mono text-ink-muted tabular-nums font-semibold shrink-0">
                    {cat.count} ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-300"
                    style={{ width: `${Math.max(6, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-console-border/50 flex items-center justify-between text-xs text-ink-muted">
        <span>{t("Total Active Workload")}: <strong className="text-ink">{totalActive} {t("tickets")}</strong></span>
        <Link to="/staff/reports" className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">
          <span>{t("Dispatch console")}</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
