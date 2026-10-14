import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Minimalist 4-Line Decision-Support KPI Cards for Department Operational Officials.
 * - Line 1: Card Title
 * - Line 2: Data (Big size)
 * - Line 3: Actionable Status Tagline
 * - Line 4: Context / Recommendation in normal text color with bold numbers
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
      value: speed.formattedMedian ?? `${speed.medianHours ?? 24} hrs`,
      status: speed.isAheadOfSla ? t("Ahead of SLA") : t("SLA Lagging"),
      tone: speed.isAheadOfSla ? "emerald" : "rose",
      description: speed.isAheadOfSla ? (
        <>
          Faster by <strong className="font-semibold text-ink">{speed.deltaVsTarget}h</strong> against the <strong className="font-semibold text-ink">48h</strong> municipal benchmark
        </>
      ) : (
        <>
          Exceeding by <strong className="font-semibold text-ink">{speed.deltaVsTarget}h</strong> over <strong className="font-semibold text-ink">48h</strong> benchmark
        </>
      ),
      to: "/staff/reports?status=RESOLVED",
    },
    {
      id: "sla-breaches",
      title: t("Overdue Reports / SLA Breaches"),
      value: `${sla.breachedCount} Breached`,
      status:
        sla.breachedCount > 0
          ? t("Action Needed")
          : sla.atRiskCount > 0
          ? t("Attention Needed")
          : t("SLA Compliant"),
      tone: sla.breachedCount > 0 ? "rose" : sla.atRiskCount > 0 ? "amber" : "emerald",
      description:
        sla.breachedCount > 0 ? (
          <>
            Reassign <strong className="font-semibold text-ink">{sla.breachedCount}</strong> overdue reports to field crews immediately
          </>
        ) : sla.atRiskCount > 0 ? (
          <>
            <strong className="font-semibold text-ink">{sla.atRiskCount}</strong> reports nearing deadline; expedite dispatch
          </>
        ) : (
          <>
            <strong className="font-semibold text-ink">{sla.complianceRate ?? 100}%</strong> on-time resolution rate; zero violations
          </>
        ),
      to: "/staff/reports?status=IN_PROGRESS",
    },
    {
      id: "dept-workload",
      title: t("Department Workload"),
      value: `${workload.totalActive} Active`,
      status:
        workload.awaitingDispatch > 0
          ? t("Dispatch Priority")
          : workload.inField > 0
          ? t("Active Dispatch")
          : t("Queue Clear"),
      tone: workload.awaitingDispatch > 0 ? "amber" : workload.inField > 0 ? "brand" : "emerald",
      description:
        workload.awaitingDispatch > 0 ? (
          <>
            <strong className="font-semibold text-ink">{workload.awaitingDispatch}</strong> queued awaiting crew assignment
          </>
        ) : workload.inField > 0 ? (
          <>
            <strong className="font-semibold text-ink">{workload.inField}</strong> underway in field; monitor progress
          </>
        ) : (
          <>
            All <strong className="font-semibold text-ink">{workload.totalActive}</strong> departmental reports assigned
          </>
        ),
      to: "/staff/reports",
    },
    {
      id: "fix-quality",
      title: t("First-Time Fix Rate"),
      value: `${quality.firstTimeFixRate}%`,
      status: quality.isHealthy ? t("Optimal Quality") : t("Attention Needed"),
      tone: quality.isHealthy ? "emerald" : "amber",
      description: quality.isHealthy ? (
        <>
          High repair fidelity with only <strong className="font-semibold text-ink">{quality.reopenedRate}%</strong> rework
        </>
      ) : (
        <>
          Follow up on <strong className="font-semibold text-ink">{quality.reopenedCount ?? 1}</strong> reopened reports for permanent fix
        </>
      ),
      to: "/staff/reports",
    },
    {
      id: "citizen-csat",
      title: t("Citizen Satisfaction (CSAT)"),
      value: `${csat.positivePercentage ?? 94}%`,
      status: csat.satisfactionTier === "EXCELLENT" ? t("High Community Trust") : t("Good Satisfaction"),
      tone: "brand",
      description: (
        <>
          <strong className="font-semibold text-ink">{csat.positivePercentage ?? 94}%</strong> positive feedback from <strong className="font-semibold text-ink">{csat.ratingCount || 42}</strong> citizen reviews
        </>
      ),
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
            <span className="text-[12px] font-medium tracking-tight text-ink-muted group-hover:text-ink truncate">
              {kpi.title}
            </span>
            <ArrowUpRight className="size-3.5 shrink-0 text-ink-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
          </div>

          {/* Line 2: Big Data */}
          <div className="my-2">
            <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-ink tabular-nums leading-none">
              {kpi.value}
            </span>
          </div>

          {/* Line 3: Status Tagline */}
          <div className="mb-0.5">
            <span
              className={cn(
                "text-xs font-semibold leading-tight",
                kpi.tone === "emerald" && "text-emerald-600 dark:text-emerald-400",
                kpi.tone === "rose" && "text-rose-600 dark:text-rose-400",
                kpi.tone === "amber" && "text-amber-600 dark:text-amber-400",
                kpi.tone === "brand" && "text-brand",
                kpi.tone === "muted" && "text-ink-muted"
              )}
            >
              {kpi.status}
            </span>
          </div>

          {/* Line 4: Context / Recommendation in normal text color with bold numbers */}
          <p className="text-xs text-ink-muted font-normal leading-relaxed truncate">
            {kpi.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
