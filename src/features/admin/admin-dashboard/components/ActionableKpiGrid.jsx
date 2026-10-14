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
      tagline: speed.hasData
        ? speed.isAheadOfSla
          ? t("Ahead of SLA · {delta}h faster than 48h city target", { delta: speed.deltaVsTarget })
          : t("SLA Lagging · {delta}h over target; accelerate dispatches", { delta: speed.deltaVsTarget })
        : t("Awaiting resolved reports to calculate turnaround"),
      tone: speed.hasData ? (speed.isAheadOfSla ? "emerald" : "rose") : "muted",
      to: "/admin/reports?status=RESOLVED",
    },
    {
      id: "sla-breaches",
      title: t("Overdue Reports / SLA Breaches"),
      value: `${sla.breachedCount} Breached`,
      tagline: sla.breachedCount > 0
        ? t("Action needed · Reassign {count} overdue reports immediately", { count: sla.breachedCount })
        : sla.atRiskCount > 0
        ? t("Attention · {count} reports nearing deadline; dispatch crews", { count: sla.atRiskCount })
        : t("SLA Compliant · 100% on-time resolution across departments"),
      tone: sla.breachedCount > 0 ? "rose" : sla.atRiskCount > 0 ? "amber" : "emerald",
      to: "/admin/reports?status=IN_PROGRESS",
    },
    {
      id: "fix-quality",
      title: t("First-Time Fix Rate"),
      value: quality.hasData ? `${quality.firstTimeFixRate}%` : "100%",
      tagline: quality.hasData
        ? quality.isHealthy
          ? t("Optimal · Only {rate}% rework rate across departments", { rate: quality.reopenedRate })
          : t("Attention · High rework rate; review field verification", { rate: quality.reopenedRate })
        : t("High Quality · Zero repeat reopens across {count} resolved reports", { count: quality.totalResolved }),
      tone: quality.hasData ? (quality.isHealthy ? "emerald" : "amber") : "emerald",
      to: "/admin/reports",
    },
    {
      id: "citizen-csat",
      title: t("Citizen Satisfaction (CSAT)"),
      value: csat.hasData ? `${csat.averageRating} / 5.0` : "5.0 / 5.0",
      tagline: csat.hasData
        ? t("{tier} · {pos}% positive feedback (≥ 4★ ratings)", {
            tier: csat.satisfactionTier === "EXCELLENT" ? t("High Trust") : t("Good"),
            pos: csat.positivePercentage,
          })
        : t("Civic Trust Benchmark · Awaiting citizen feedback on resolved tickets"),
      tone: csat.hasData ? "brand" : "muted",
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
          <div className="my-2.5">
            <span className="font-display text-3xl font-bold tracking-tight text-ink tabular-nums leading-none">
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
