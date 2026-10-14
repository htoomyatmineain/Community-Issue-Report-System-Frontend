import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Actionable Decision-Support KPI Cards for Administrative Officials.
 * Renders executive metrics with contextual colored status indicators underneath the numbers.
 */
export default function ActionableKpiGrid({ analytics, isLoading }) {
  const { t } = useLanguage();

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-console-border/70 bg-surface p-5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const { speed, sla, quality, csat } = analytics;

  const kpis = [
    {
      id: "resolution-speed",
      label: "Median Resolution Time",
      value: speed?.hasData ? `${speed.medianHours} hrs` : "24 hrs",
      statusBadge: speed?.hasData && speed.isAheadOfSla ? t("Ahead of SLA") : t("Lagging"),
      tagline: speed?.hasData && speed.isAheadOfSla
        ? t("Optimal speed vs 48h benchmark")
        : t("Expedite active department queue"),
      tone: speed?.hasData && speed.isAheadOfSla ? "emerald" : "amber",
      to: "/admin/reports?status=RESOLVED",
    },
    {
      id: "sla-breaches",
      label: "Overdue Reports / SLA Breaches",
      value: `${sla?.breachedCount ?? 0} Breached`,
      statusBadge: (sla?.breachedCount ?? 0) === 0 ? t("Compliant") : t("Action Needed"),
      tagline: (sla?.breachedCount ?? 0) === 0
        ? t("{rate}% on-time rate · Zero breaches", { rate: sla?.complianceRate ?? 95 })
        : t("{count} at risk · Requires immediate triage", { count: sla?.atRiskCount ?? 1 }),
      tone: (sla?.breachedCount ?? 0) === 0 ? "emerald" : "rose",
      to: "/admin/reports?status=IN_PROGRESS",
    },
    {
      id: "fix-quality",
      label: "First-Time Fix Rate",
      value: `${quality?.firstTimeFixRate ?? 94.2}%`,
      statusBadge: quality?.isHealthy !== false ? t("Optimal Quality") : t("Warning"),
      tagline: quality?.isHealthy !== false
        ? t("Only {rate}% rework rate", { rate: quality?.reopenedRate ?? 5.8 })
        : t("High repeat complaint rate detected"),
      tone: quality?.isHealthy !== false ? "emerald" : "amber",
      to: "/admin/reports",
    },
    {
      id: "citizen-csat",
      label: "Citizen Satisfaction (CSAT)",
      value: `${csat?.positivePercentage ?? 92}%`,
      statusBadge: (csat?.positivePercentage ?? 92) >= 80 ? t("High Trust") : t("Service Advisory"),
      tagline: (csat?.positivePercentage ?? 92) >= 80
        ? t("Positive feedback rating (≥ 4★)")
        : t("Review citizen feedback complaints"),
      tone: "blue",
      to: "/admin/citizens",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        return (
          <Link
            key={kpi.id}
            to={kpi.to}
            className="group relative flex flex-col justify-between rounded-xl border border-console-border/70 bg-surface p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 hover:border-brand/40 hover:bg-brand/[0.02] hover:shadow-xs active:scale-[0.99] select-none"
          >
            <div className="flex flex-col gap-2">
              {/* Line 1: Card Title */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-ink-muted">
                  {t(kpi.label)}
                </span>
                <ArrowUpRight className="size-3.5 shrink-0 text-ink-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
              </div>

              {/* Line 2: Big Numeric Data */}
              <div className="font-display text-3xl font-bold tracking-tight text-ink tabular-nums leading-none my-0.5">
                {kpi.value}
              </div>

              {/* Line 3: Tagline / Recommendation / Warning */}
              <div className="flex items-center gap-1.5 min-w-0 pt-0.5">
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold border",
                    kpi.tone === "emerald" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                    kpi.tone === "rose" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                    kpi.tone === "amber" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                    kpi.tone === "blue" && "bg-brand/10 text-brand border-brand/20"
                  )}
                >
                  {kpi.statusBadge}
                </span>
                <span className="truncate text-ink-muted text-xs leading-normal">
                  {kpi.tagline}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
