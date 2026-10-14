import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, ShieldAlert, Layers, CheckCircle2, Star } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Actionable Decision-Support KPI Cards for Department Operational Officials.
 * Renders dynamically calculated metrics: Median Resolution Time, Overdue Reports,
 * Department Workload, Reopened Issues, and Citizen Satisfaction.
 */
export default function StaffKpiGrid({ analytics, isLoading }) {
  const { t } = useLanguage();

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-console-border/70 bg-surface p-5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const { speed, sla, workload, quality, csat } = analytics;

  const kpis = [
    {
      id: "resolution-speed",
      label: "Median Resolution Time",
      icon: Clock,
      value: `${speed.formattedMedian ?? `${speed.medianHours}h`}`,
      statusText: speed.isAheadOfSla ? t("Ahead of SLA") : t("SLA Lagging"),
      tone: speed.isAheadOfSla ? "emerald" : "rose",
      subtext: t("{hours}h vs 48h benchmark", { hours: `${speed.deltaVsTarget}` }),
      to: "/staff/reports?status=RESOLVED",
    },
    {
      id: "sla-breaches",
      label: "Overdue Reports / SLA Breaches",
      icon: ShieldAlert,
      value: `${sla.breachedCount} Breached`,
      statusText: sla.breachedCount === 0 ? t("Compliant") : t("Action Needed"),
      tone: sla.breachedCount === 0 ? "emerald" : "rose",
      subtext: t("{atRisk} at-risk · {rate}% on-time rate", {
        atRisk: sla.atRiskCount,
        rate: sla.complianceRate,
      }),
      to: "/staff/reports?status=IN_PROGRESS",
    },
    {
      id: "dept-workload",
      label: "Department Workload",
      icon: Layers,
      value: `${workload.totalActive} Active`,
      statusText: t("Active Dispatch"),
      tone: "brand",
      subtext: t("{inField} in field · {queued} queued", {
        inField: workload.inField,
        queued: workload.awaitingDispatch,
      }),
      to: "/staff/reports",
    },
    {
      id: "fix-quality",
      label: "First-Time Fix Rate",
      icon: CheckCircle2,
      value: `${quality.firstTimeFixRate}%`,
      statusText: quality.isHealthy ? t("Optimal") : t("Attention"),
      tone: quality.isHealthy ? "emerald" : "amber",
      subtext: t("Only {rate}% flagged for rework", { rate: `${quality.reopenedRate}` }),
      to: "/staff/reports",
    },
    {
      id: "citizen-csat",
      label: "Citizen Satisfaction (CSAT)",
      icon: Star,
      value: `${csat.averageRating} / 5.0`,
      statusText: csat.satisfactionTier === "EXCELLENT" ? t("High Trust") : t("Good"),
      tone: "amber",
      hasStar: true,
      subtext: t("{pos}% positive feedback (≥ 4★)", { pos: csat.positivePercentage }),
      to: "/staff/reports",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Link
            key={kpi.id}
            to={kpi.to}
            className="group relative flex flex-col justify-between rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 hover:border-brand/40 hover:bg-surface-muted/40 hover:shadow-xs active:scale-[0.99] select-none"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold tracking-tight text-ink-muted group-hover:text-ink truncate">
                  {t(kpi.label)}
                </span>
                <ArrowUpRight className="size-3.5 shrink-0 text-ink-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
              </div>

              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
                  {kpi.value}
                </span>
              </div>
            </div>

            <div className="mt-3.5 flex flex-col gap-1 border-t border-console-border/40 pt-2.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    kpi.tone === "emerald" &&
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                    kpi.tone === "rose" &&
                      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
                    kpi.tone === "amber" &&
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                    kpi.tone === "brand" &&
                      "bg-brand/10 text-brand border border-brand/20"
                  )}
                >
                  {kpi.hasStar && <Star className="size-2.5 fill-amber-500 text-amber-500" />}
                  {kpi.statusText}
                </span>
              </div>
              <span className="text-[11px] text-ink-muted truncate">
                {kpi.subtext}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
