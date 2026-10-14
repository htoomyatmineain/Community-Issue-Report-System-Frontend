import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, ShieldAlert, Layers, CheckCircle2, Star } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Minimalist 3-Line Decision-Support KPI Cards for Department Operational Officials.
 * - Line 1: Card Title
 * - Line 2: Data (Big size)
 * - Line 3: Actionable tagline / status / recommendation
 */
export default function StaffKpiGrid({ analytics, isLoading }) {
  const { t } = useLanguage();

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-console-border/70 bg-surface p-5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const { speed, sla, workload, quality, csat } = analytics;

  const kpis = [
    {
      id: "resolution-speed",
      title: t("Median Resolution Time"),
      value: `${speed.formattedMedian ?? `${speed.medianHours}h`}`,
      tagline: speed.isAheadOfSla
        ? t("Ahead of SLA · {hours}h faster than 48h municipal benchmark", { hours: speed.deltaVsTarget })
        : t("SLA Lagging · Expedite field crew dispatch to recover benchmark"),
      tone: speed.isAheadOfSla ? "emerald" : "rose",
      to: "/staff/reports?status=RESOLVED",
    },
    {
      id: "sla-breaches",
      title: t("Overdue Reports / SLA Breaches"),
      value: `${sla.breachedCount} Breached`,
      tagline: sla.breachedCount > 0
        ? t("Action needed · Reassign {count} overdue reports immediately", { count: sla.breachedCount })
        : sla.atRiskCount > 0
        ? t("Attention · {count} reports nearing deadline; prioritize queue", { count: sla.atRiskCount })
        : t("SLA Compliant · {rate}% on-time rate; zero violations", { rate: sla.complianceRate }),
      tone: sla.breachedCount > 0 ? "rose" : sla.atRiskCount > 0 ? "amber" : "emerald",
      to: "/staff/reports?status=IN_PROGRESS",
    },
    {
      id: "dept-workload",
      title: t("Department Workload"),
      value: `${workload.totalActive} Active`,
      tagline: workload.awaitingDispatch > 0
        ? t("Dispatch priority · {queued} queued awaiting crew assignment", { queued: workload.awaitingDispatch })
        : workload.inField > 0
        ? t("Active dispatch · {inField} underway in field; monitor progress", { inField: workload.inField })
        : t("Queue clear · All departmental reports assigned or resolved"),
      tone: workload.awaitingDispatch > 0 ? "amber" : workload.inField > 0 ? "brand" : "emerald",
      to: "/staff/reports",
    },
    {
      id: "fix-quality",
      title: t("First-Time Fix Rate"),
      value: `${quality.firstTimeFixRate}%`,
      tagline: quality.isHealthy
        ? t("Optimal · High repair quality with only {rate}% rework", { rate: quality.reopenedRate })
        : t("Attention · Follow up on reopened reports to ensure permanent fixes"),
      tone: quality.isHealthy ? "emerald" : "amber",
      to: "/staff/reports",
    },
    {
      id: "citizen-csat",
      title: t("Citizen Satisfaction (CSAT)"),
      value: `${csat.averageRating} / 5.0`,
      tagline: csat.satisfactionTier === "EXCELLENT"
        ? t("High Trust · {pos}% positive community ratings (≥ 4★)", { pos: csat.positivePercentage })
        : t("Good · Maintain post-resolution follow-up to boost trust"),
      tone: csat.satisfactionTier === "EXCELLENT" ? "emerald" : "brand",
      to: "/staff/reports",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <Link
          key={kpi.id}
          to={kpi.to}
          className="group relative flex flex-col justify-between rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 hover:border-brand/40 hover:bg-surface-muted/30 hover:shadow-xs active:scale-[0.99] select-none"
        >
          {/* Line 1: Card Title */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold tracking-tight text-ink-muted group-hover:text-ink truncate">
              {kpi.title}
            </span>
            <ArrowUpRight className="size-3.5 shrink-0 text-ink-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
          </div>

          {/* Line 2: Big Data */}
          <div className="my-2.5">
            <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-ink tabular-nums leading-none">
              {kpi.value}
            </span>
          </div>

          {/* Line 3: Related Tagline / Status / Recommendation */}
          <p
            className={cn(
              "text-xs font-medium truncate leading-tight",
              kpi.tone === "emerald" && "text-emerald-600 dark:text-emerald-400",
              kpi.tone === "rose" && "text-rose-600 dark:text-rose-400",
              kpi.tone === "amber" && "text-amber-600 dark:text-amber-400",
              kpi.tone === "brand" && "text-brand",
              kpi.tone === "muted" && "text-ink-muted"
            )}
            title={kpi.tagline}
          >
            {kpi.tagline}
          </p>
        </Link>
      ))}
    </div>
  );
}
