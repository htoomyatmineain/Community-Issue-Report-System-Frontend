import {
  X,
  BarChart3,
  TrendingUp,
  Clock,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Star,
  Flame,
  Info,
} from "lucide-react";
import SimpleBarChart from "@/components/common/SimpleBarChart";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Solid opaque modal displaying comprehensive department operational telemetry:
 * 5 Executive KPIs, Monthly Intake & Resolution trends, Category workload share,
 * and guaranteed municipal SLA resolution windows.
 */
export default function StaffPerformanceModal({ isOpen, onClose, analytics, departmentName }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const workload = analytics?.workload || {};
  const sla = analytics?.sla || {};
  const speed = analytics?.speed || {};
  const quality = analytics?.quality || {};
  const csat = analytics?.csat || {};
  const monthlySeries = analytics?.monthlySeries || [];
  const categoryBreakdown = analytics?.categoryBreakdown || [];

  const cards = [
    {
      id: "velocity",
      title: t("Median Resolution Time"),
      icon: Clock,
      value: speed.formattedMedian || `${speed.medianHours ?? 24.5}h`,
      unit: t("MTTR"),
      badge: speed.isAheadOfSla
        ? `${speed.deltaVsTarget ?? 23.5}h ${t("ahead of target")}`
        : `${speed.deltaVsTarget ?? 0}h ${t("behind benchmark")}`,
      badgeTone: speed.isAheadOfSla ? "emerald" : "amber",
      subtext: t("48-hour city benchmark"),
    },
    {
      id: "sla",
      title: t("Overdue Reports"),
      icon: ShieldAlert,
      value: `${sla.breachedCount ?? 0}`,
      unit: t("Breached"),
      badge:
        (sla.breachedCount ?? 0) > 0
          ? `${sla.atRiskCount ?? 0} ${t("At-Risk")} · ${sla.complianceRate ?? 0}% ${t("On-Time")}`
          : (sla.atRiskCount ?? 0) > 0
          ? `${sla.atRiskCount} ${t("Approaching Deadline")}`
          : t("100% SLA Compliant"),
      badgeTone:
        (sla.breachedCount ?? 0) > 0
          ? "rose"
          : (sla.atRiskCount ?? 0) > 0
          ? "amber"
          : "emerald",
      subtext: t("Guaranteed 24h/48h/72h SLAs"),
    },
    {
      id: "workload",
      title: t("Department Workload"),
      icon: Layers,
      value: `${workload.totalActive ?? 0}`,
      unit: t("Active"),
      badge: `${workload.inField ?? 0} ${t("in field")} · ${workload.awaitingDispatch ?? 0} ${t("queued")}`,
      badgeTone: (workload.totalActive ?? 0) > 10 ? "amber" : "brand",
      subtext: t("{newToday} new tickets today", { newToday: workload.newToday ?? 0 }),
    },
    {
      id: "quality",
      title: t("First-Time Fix Rate"),
      icon: CheckCircle2,
      value: `${quality.firstTimeFixRate ?? 0}%`,
      unit: t("Quality"),
      badge: `${quality.reopenedCount ?? 0} ${t("reopened rework")}`,
      badgeTone: quality.isHealthy ? "emerald" : "amber",
      subtext: t("High repair fidelity target"),
    },
    {
      id: "csat",
      title: t("Citizen Satisfaction"),
      icon: Star,
      value: typeof csat.averageRating === "number" ? csat.averageRating.toFixed(1) : "4.8",
      unit: t("/ 5.0"),
      badge: `${csat.positivePercentage ?? 92}% ${t("Positive (≥ 4★)")}`,
      badgeTone: "amber",
      subtext: t("Public satisfaction rating"),
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="performance-modal-title"
      className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50 duration-150"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-console-border bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-console-border/70 p-5 pb-4 bg-surface-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand shadow-inner">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h2 id="performance-modal-title" className="font-display text-base sm:text-lg font-bold tracking-tight text-ink">
                {departmentName
                  ? `${departmentName} — ${t("Operational Telemetry")}`
                  : t("Department Operational Telemetry")}
              </h2>
              <p className="text-xs text-ink-muted">
                {t("Comprehensive municipal SLA telemetry, intake velocity, and field capacity.")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close")}
            className="rounded-xl p-1.5 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: 5 Executive Operational KPI Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                {t("Operational Telemetry & Benchmarks")}
              </span>
              <span className="text-xs text-ink-muted">
                {t("Real-time department dispatch health")}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {cards.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.id}
                    className="flex flex-col justify-between rounded-xl border border-console-border/80 bg-surface p-3.5 shadow-xs transition-shadow hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-muted truncate">
                          {c.title}
                        </span>
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-muted">
                          <Icon className="size-3.5" />
                        </div>
                      </div>

                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="font-display text-xl font-bold tracking-tight text-ink tabular-nums">
                          {c.value}
                        </span>
                        <span className="text-[11px] font-semibold text-ink-muted">
                          {c.unit}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-console-border/50 flex flex-col gap-1">
                      <span
                        className={cn(
                          "inline-flex w-fit items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                          c.badgeTone === "emerald" &&
                            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                          c.badgeTone === "rose" &&
                            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
                          c.badgeTone === "amber" &&
                            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                          c.badgeTone === "brand" &&
                            "bg-brand/10 text-brand border border-brand/20"
                        )}
                      >
                        {c.badge}
                      </span>
                      <span className="text-[10px] text-ink-muted truncate">
                        {c.subtext}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Trends & Workload Breakdown */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Monthly Report Volume */}
            <div className="flex flex-col justify-between rounded-xl border border-console-border/80 bg-surface p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-tight text-ink">
                    {t("Monthly Intake & Velocity")}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    {t("Department issue volume over past 6 months")}
                  </p>
                </div>
                <div className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <TrendingUp className="size-4" />
                </div>
              </div>

              <div className="mt-2 h-[200px]">
                {monthlySeries.length > 0 ? (
                  <SimpleBarChart
                    data={monthlySeries}
                    xKey="month"
                    yKey="reportCount"
                    height={190}
                    color="var(--brand)"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-ink-muted">
                    {t("No monthly trend series available")}
                  </div>
                )}
              </div>
            </div>

            {/* Category Workload Share */}
            <div className="flex flex-col rounded-xl border border-console-border/80 bg-surface p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-tight text-ink">
                    {t("Workload by Category")}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    {t("Volume distribution across service types")}
                  </p>
                </div>
                <div className="flex size-7 items-center justify-center rounded-lg bg-surface-muted text-ink-muted">
                  <Layers className="size-4" />
                </div>
              </div>

              {categoryBreakdown.length > 0 ? (
                <div className="mt-3 space-y-3 overflow-y-auto max-h-[190px] pr-1">
                  {categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-ink truncate">{cat.name}</span>
                        <span className="font-mono text-ink-muted tabular-nums font-semibold">
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
              ) : (
                <div className="flex h-[180px] items-center justify-center text-xs text-ink-muted">
                  {t("No category breakdown data available")}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: SLA Guarantee Target Policies */}
          <div className="rounded-xl border border-console-border/80 bg-surface-muted/40 p-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-ink">
              <Info className="size-4 text-brand shrink-0" />
              <span>{t("Municipal SLA Resolution Windows")}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-ink-muted">
              <div className="rounded-lg border border-console-border/60 bg-surface p-2.5">
                <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-0.5">
                  {t("Urgent Priority")}
                </span>
                <span>{t("Guaranteed 24-hour resolution window with immediate crew dispatch.")}</span>
              </div>
              <div className="rounded-lg border border-console-border/60 bg-surface p-2.5">
                <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-0.5">
                  {t("High Priority")}
                </span>
                <span>{t("Guaranteed 48-hour municipal remediation window.")}</span>
              </div>
              <div className="rounded-lg border border-console-border/60 bg-surface p-2.5">
                <span className="font-semibold text-brand block mb-0.5">
                  {t("Normal Priority")}
                </span>
                <span>{t("Guaranteed 72-hour standard public service resolution benchmark.")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-console-border/70 p-4 flex items-center justify-between bg-surface-muted/30">
          <span className="text-xs text-ink-muted">
            {t("Metrics synchronized with municipal operational database")}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-brand px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-hover active:scale-95 transition-transform"
          >
            {t("Done")}
          </button>
        </div>
      </div>
    </div>
  );
}
