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
      value: speed.hasData ? `${speed.medianHours} hrs` : "N/A",
      statusText: speed.hasData ? (speed.isAheadOfSla ? t("Ahead of SLA") : t("SLA Lagging")) : t("No Data"),
      tone: speed.hasData ? (speed.isAheadOfSla ? "emerald" : "rose") : "muted",
      subtext: speed.hasData ? t("{hours}h vs 48h benchmark", { hours: `${speed.deltaVsTarget}` }) : t("Requires resolved reports"),
      to: "/admin/reports?status=RESOLVED",
    },
    {
      id: "sla-breaches",
      label: "Overdue Reports / SLA Breaches",
      value: `${sla.breachedCount} Breached`,
      statusText: sla.breachedCount === 0 ? t("Compliant") : t("Action Needed"),
      tone: sla.breachedCount === 0 ? "emerald" : "rose",
      subtext: t("{atRisk} at-risk · {rate}% on-time rate", {
        atRisk: sla.atRiskCount,
        rate: sla.complianceRate,
      }),
      to: "/admin/reports?status=IN_PROGRESS",
    },
    {
      id: "fix-quality",
      label: "First-Time Fix Rate",
      value: quality.hasData ? `${quality.firstTimeFixRate}%` : "N/A",
      statusText: quality.hasData ? (quality.isHealthy ? t("Optimal") : t("Attention")) : t("Untracked"),
      tone: quality.hasData ? (quality.isHealthy ? "emerald" : "amber") : "muted",
      subtext: quality.hasData ? t("Only {rate}% flagged for rework", { rate: `${quality.reopenedRate}` }) : t("Requires rework tracking"),
      to: "/admin/reports",
    },
    {
      id: "citizen-csat",
      label: "Citizen Satisfaction (CSAT)",
      value: csat.hasData ? `${csat.averageRating} / 5.0` : "N/A",
      statusText: csat.hasData ? (csat.satisfactionTier === "EXCELLENT" ? t("High Trust") : t("Good")) : t("No Ratings"),
      tone: csat.hasData ? "blue" : "muted",
      subtext: csat.hasData ? t("{pos}% positive feedback (≥ 4★)", { pos: csat.positivePercentage }) : t("Awaiting citizen feedback"),
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
            className="group relative flex flex-col justify-between rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 hover:border-brand/40 hover:bg-surface-muted/40 hover:shadow-xs active:scale-[0.99] select-none"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium tracking-tight text-ink-muted">
                  {t(kpi.label)}
                </span>
                <ArrowUpRight className="size-3.5 shrink-0 text-ink-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
              </div>

              <div className="mt-3">
                <span className="font-display text-3xl font-semibold tracking-tight text-ink tabular-nums leading-none">
                  {kpi.value}
                </span>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs leading-normal">
                  <span
                    className={cn(
                      "font-semibold",
                      kpi.tone === "emerald" && "text-emerald-600 dark:text-emerald-400",
                      kpi.tone === "rose" && "text-rose-600 dark:text-rose-400",
                      kpi.tone === "amber" && "text-amber-600 dark:text-amber-400",
                      kpi.tone === "blue" && "text-brand"
                    )}
                  >
                    {kpi.statusText}
                  </span>
                  <span className="text-ink-muted/50">·</span>
                  <span className="text-ink-muted truncate">{kpi.subtext}</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
