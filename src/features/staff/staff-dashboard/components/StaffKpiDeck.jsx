import { useState } from "react";
import {
  Clock,
  ShieldAlert,
  Layers,
  Flame,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Star,
  PieChart,
  Activity,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Solid opaque Decision Support & Telemetry Deck docked along the bottom of the interactive map.
 * Displays 5 actionable KPIs plus related data: Category Distribution and SLA Countdown Health.
 * High-contrast, interactive GIS filtering with zero glassmorphism.
 */
export default function StaffKpiDeck({
  analytics,
  onSelectFilter,
  activeFilter,
  onSelectCategory,
  selectedCategory,
}) {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("KPIS"); // "KPIS" | "CATEGORIES" | "SLA_RADAR"

  if (!analytics) return null;

  const workload = analytics.workload || {};
  const sla = analytics.sla || {};
  const speed = analytics.speed || {};
  const quality = analytics.quality || {};
  const csat = analytics.csat || {};
  const categories = analytics.categoryBreakdown || [];

  const cards = [
    {
      id: "velocity",
      title: t("Median Resolution Time"),
      icon: Clock,
      value: speed.formattedMedian || `${speed.medianHours ?? 24}h`,
      unit: t("MTTR"),
      badge: speed.isAheadOfSla
        ? `${speed.deltaVsTarget ?? 0}h ${t("ahead of target")}`
        : `${speed.deltaVsTarget ?? 0}h ${t("behind benchmark")}`,
      badgeTone: speed.isAheadOfSla ? "emerald" : "amber",
      subtext: t("48-hour city benchmark"),
      isActive: false,
      onClick: () => {},
    },
    {
      id: "sla",
      title: t("Overdue Reports"),
      icon: ShieldAlert,
      value: `${sla.breachedCount ?? 0}`,
      unit: t("Breached"),
      badge:
        (sla.breachedCount ?? 0) > 0
          ? `${sla.atRiskCount ?? 0} ${t("At-Risk")} · ${sla.complianceRate ?? 95}% ${t("On-Time")}`
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
      isActive: activeFilter === "URGENT",
      onClick: () => onSelectFilter?.(activeFilter === "URGENT" ? "ALL" : "URGENT"),
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
      isActive: activeFilter === "IN_PROGRESS",
      onClick: () => onSelectFilter?.(activeFilter === "IN_PROGRESS" ? "ALL" : "IN_PROGRESS"),
    },
    {
      id: "quality",
      title: t("First-Time Fix Rate"),
      icon: CheckCircle2,
      value: `${quality.firstTimeFixRate ?? 93.8}%`,
      unit: t("Quality"),
      badge: `${quality.reopenedCount ?? 1} ${t("reopened rework")}`,
      badgeTone: quality.isHealthy ? "emerald" : "amber",
      subtext: t("High repair fidelity target"),
      isActive: false,
      onClick: () => {},
    },
    {
      id: "csat",
      title: t("Citizen Satisfaction"),
      icon: Star,
      value: `${csat.positivePercentage ?? 92}%`,
      unit: t("CSAT"),
      badge: `${csat.positivePercentage ?? 92}% ${t("Positive Rating")}`,
      badgeTone: "brand",
      hasStar: false,
      subtext: t("Public satisfaction rating"),
      isActive: false,
      onClick: () => {},
    },
  ];

  return (
    <div className="pointer-events-none absolute left-3 bottom-3 z-[490] max-w-sm sm:left-5 sm:bottom-4 sm:max-w-none">
      <div className="pointer-events-auto flex flex-col gap-2">
        {/* Toggle Collapse & View Tabs Header */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 rounded-full border border-console-border bg-surface px-3 py-1 text-[11px] font-semibold text-ink shadow-md transition-all hover:bg-surface-muted active:scale-95"
          >
            <span className="size-1.5 rounded-full bg-brand animate-pulse" />
            <span>{isCollapsed ? t("Show Telemetry Deck") : t("Hide Telemetry Deck")}</span>
            {isCollapsed ? (
              <ChevronUp className="size-3 text-ink-muted" />
            ) : (
              <ChevronDown className="size-3 text-ink-muted" />
            )}
          </button>

          {/* Related Data View Switcher Tabs (Only visible when expanded) */}
          {!isCollapsed && (
            <div className="flex items-center rounded-full border border-console-border bg-surface p-0.5 shadow-md">
              <button
                type="button"
                onClick={() => setActiveTab("KPIS")}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all",
                  activeTab === "KPIS"
                    ? "bg-brand text-white shadow-xs"
                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                )}
              >
                <Activity className="size-3" />
                <span>{t("5 Operational KPIs")}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("CATEGORIES")}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all",
                  activeTab === "CATEGORIES"
                    ? "bg-brand text-white shadow-xs"
                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                )}
              >
                <PieChart className="size-3" />
                <span>{t("Category Workload")}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("SLA_RADAR")}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all",
                  activeTab === "SLA_RADAR"
                    ? "bg-brand text-white shadow-xs"
                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                )}
              >
                <ShieldAlert className="size-3" />
                <span>{t("SLA Countdown Radar")}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Deck Body */}
        {!isCollapsed && (
          <div>
            {/* VIEW 1: 5 ACTIONABLE DECISION SUPPORT KPIS */}
            {activeTab === "KPIS" && (
              <div className="flex max-w-[calc(100vw-2rem)] gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5 lg:max-w-none">
                {cards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      onClick={card.onClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && card.onClick?.()}
                      className={cn(
                        "group relative flex w-36 shrink-0 flex-col justify-between rounded-2xl border bg-surface p-3 shadow-lg transition-all duration-150 sm:w-auto hover:-translate-y-0.5 active:scale-[0.98]",
                        card.isActive
                          ? "border-brand ring-2 ring-brand/30 bg-brand/5"
                          : "border-console-border hover:border-brand/60"
                      )}
                    >
                      {/* Line 1: Card Title */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="truncate text-[11px] font-semibold text-ink-muted group-hover:text-ink">
                          {card.title}
                        </span>
                        <Icon className="size-3.5 shrink-0 text-ink-muted/50 group-hover:text-brand" />
                      </div>

                      {/* Line 2: Big Data */}
                      <div className="my-1.5 flex items-baseline gap-1.5">
                        <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink tabular-nums">
                          {card.value}
                        </span>
                        <span className="text-[11px] font-semibold text-ink-muted">{card.unit}</span>
                      </div>

                      {/* Line 3: Related Tagline / Status / Recommendation */}
                      <p
                        className={cn(
                          "truncate text-[10px] font-medium leading-tight",
                          card.badgeTone === "emerald" && "text-emerald-600 dark:text-emerald-400",
                          card.badgeTone === "rose" && "text-rose-600 dark:text-rose-400",
                          card.badgeTone === "amber" && "text-amber-600 dark:text-amber-400",
                          card.badgeTone === "brand" && "text-brand"
                        )}
                        title={card.badge}
                      >
                        {card.badge}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 2: RELATED DATA - CATEGORY WORKLOAD DISTRIBUTION */}
            {activeTab === "CATEGORIES" && (
              <div className="w-full max-w-lg rounded-2xl border border-console-border bg-surface p-4 shadow-xl animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between mb-3 border-b border-console-border/70 pb-2">
                  <div className="flex items-center gap-2">
                    <PieChart className="size-4 text-brand" />
                    <span className="text-xs font-bold text-ink">{t("Category Incident Distribution")}</span>
                  </div>
                  <span className="text-[10px] text-ink-muted font-medium">
                    {t("Click category to filter map")}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <div
                        key={cat.name}
                        onClick={() => onSelectCategory?.(isSelected ? null : cat.name)}
                        className={cn(
                          "cursor-pointer rounded-xl p-2 transition-all duration-150 hover:bg-surface-muted",
                          isSelected && "bg-brand/10 border border-brand/40"
                        )}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-ink truncate max-w-[240px]">{cat.name}</span>
                          <span className="font-mono text-ink-muted text-[11px] tabular-nums">
                            {cat.count} {t("reports")} ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand transition-all duration-300"
                            style={{ width: `${Math.max(5, cat.percentage)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 3: RELATED DATA - SLA COUNTDOWN RADAR */}
            {activeTab === "SLA_RADAR" && (
              <div className="w-full max-w-lg rounded-2xl border border-console-border bg-surface p-4 shadow-xl animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between mb-3 border-b border-console-border/70 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="size-4 text-rose-500" />
                    <span className="text-xs font-bold text-ink">{t("SLA Countdown & Urgency Radar")}</span>
                  </div>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    {sla.complianceRate ?? 95}% {t("Compliance")}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  <div
                    onClick={() => onSelectFilter?.("URGENT")}
                    className="cursor-pointer rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5 text-center transition-colors hover:bg-rose-500/10"
                  >
                    <span className="block text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase">
                      {t("Breached")}
                    </span>
                    <span className="font-display text-xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                      {sla.breachedCount ?? 0}
                    </span>
                    <span className="block text-[9px] text-ink-muted mt-0.5">{t("Exceeded Target")}</span>
                  </div>

                  <div
                    onClick={() => onSelectFilter?.("URGENT")}
                    className="cursor-pointer rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 text-center transition-colors hover:bg-amber-500/10"
                  >
                    <span className="block text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase">
                      {t("At-Risk")}
                    </span>
                    <span className="font-display text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {sla.atRiskCount ?? 0}
                    </span>
                    <span className="block text-[9px] text-ink-muted mt-0.5">{t("< 12h Remaining")}</span>
                  </div>

                  <div
                    onClick={() => onSelectFilter?.("ALL")}
                    className="cursor-pointer rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-center transition-colors hover:bg-emerald-500/10"
                  >
                    <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                      {t("On-Track")}
                    </span>
                    <span className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {sla.onTrackCount ?? 0}
                    </span>
                    <span className="block text-[9px] text-ink-muted mt-0.5">{t("Normal Velocity")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>{t("City Benchmark SLA Target: 48 hours")}</span>
                  <button
                    type="button"
                    onClick={() => onSelectFilter?.("ALL")}
                    className="font-semibold text-brand hover:underline"
                  >
                    {t("Reset Filter")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
