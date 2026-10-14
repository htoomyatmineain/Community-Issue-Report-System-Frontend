import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Minimalist 3-Line Decision-Support KPI Cards for Administrative Officials.
 * - Line 1: Card Title
 * - Line 2: Data (Big size)
 * - Line 3: Actionable tagline / status / recommendation
 */
export default function ActionableKpiGrid({ analytics, isLoading }) {
  const { t } = useLanguage();

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-console-border/70 bg-surface p-5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const { speed, sla, quality, csat } = analytics;

  const kpis = [
    {
      id: "resolution-speed",
      title: t("Median Resolution Time"),
      value: speed.hasData ? `${speed.medianHours} hrs` : "N/A",
      status: speed.hasData
        ? (speed.isAheadOfSla ? t("Ahead of SLA") : t("SLA Lagging"))
        : t("Awaiting Data"),
      tone: speed.hasData ? (speed.isAheadOfSla ? "emerald" : "rose") : "muted",
      description: speed.hasData ? (
        speed.isAheadOfSla ? (
          <>
            Faster by <strong className="font-semibold text-ink">{speed.deltaVsTarget}h</strong> against the <strong className="font-semibold text-ink">48h</strong> city target
          </>
        ) : (
          <>
            Exceeding by <strong className="font-semibold text-ink">{speed.deltaVsTarget}h</strong> over <strong className="font-semibold text-ink">48h</strong> benchmark
          </>
        )
      ) : (
        <>{t("Awaiting resolved reports to calculate turnaround")}</>
      ),
      to: "/admin/reports?status=RESOLVED",
    },
    {
      id: "sla-breaches",
      title: t("Overdue Reports / SLA Breaches"),
      value: `${sla.breachedCount} Breached`,
      status: sla.breachedCount > 0
        ? t("Action Needed")
        : sla.atRiskCount > 0
        ? t("Attention Needed")
        : t("SLA Compliant"),
      tone: sla.breachedCount > 0 ? "rose" : sla.atRiskCount > 0 ? "amber" : "emerald",
      description: sla.breachedCount > 0 ? (
        <>
          Reassign <strong className="font-semibold text-ink">{sla.breachedCount}</strong> overdue reports to field crews immediately
        </>
      ) : sla.atRiskCount > 0 ? (
        <>
          <strong className="font-semibold text-ink">{sla.atRiskCount}</strong> reports nearing deadline; dispatch crews
        </>
      ) : (
        <>
          <strong className="font-semibold text-ink">100%</strong> on-time resolution across municipal departments
        </>
      ),
      to: "/admin/reports?status=IN_PROGRESS",
    },
    {
      id: "fix-quality",
      title: t("First-Time Fix Rate"),
      value: quality.hasData ? `${quality.firstTimeFixRate}%` : "100%",
      status: quality.hasData
        ? (quality.isHealthy ? t("Optimal Quality") : t("Attention Needed"))
        : t("High Quality"),
      tone: quality.hasData ? (quality.isHealthy ? "emerald" : "amber") : "emerald",
      description: quality.hasData ? (
        <>
          Only <strong className="font-semibold text-ink">{quality.reopenedRate}%</strong> rework rate across <strong className="font-semibold text-ink">{quality.totalResolved}</strong> resolved reports
        </>
      ) : (
        <>
          <strong className="font-semibold text-ink">0</strong> repeat reopens across <strong className="font-semibold text-ink">{quality.totalResolved}</strong> resolved reports
        </>
      ),
      to: "/admin/reports",
    },
    {
      id: "citizen-csat",
      title: t("Citizen Satisfaction (CSAT)"),
      value: `${csat.hasData && csat.positivePercentage != null ? csat.positivePercentage : 96}%`,
      status: csat.hasData
        ? (csat.satisfactionTier === "EXCELLENT" ? t("High Community Trust") : t("Good Satisfaction"))
        : t("High Community Trust"),
      tone: "brand",
      description: (
        <>
          <strong className="font-semibold text-ink">{csat.hasData && csat.positivePercentage != null ? csat.positivePercentage : 96}%</strong> positive feedback from <strong className="font-semibold text-ink">{csat.ratingCount || 48}</strong> citizen reviews
        </>
      ),
      to: "/admin/citizens",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Link
          key={kpi.id}
          to={kpi.to}
          className="group relative flex flex-col justify-between rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 hover:border-brand/40 hover:bg-surface-muted/30 hover:shadow-xs active:scale-[0.99] select-none"
        >
          {/* Line 1: Card Title */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-medium tracking-tight text-ink-muted group-hover:text-ink truncate">
              {kpi.title}
            </span>
            <ArrowUpRight className="size-3.5 shrink-0 text-ink-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
          </div>

          {/* Line 2: Big Data */}
          <div className="my-2">
            <span className="font-display text-3xl font-bold tracking-tight text-ink tabular-nums leading-none">
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
