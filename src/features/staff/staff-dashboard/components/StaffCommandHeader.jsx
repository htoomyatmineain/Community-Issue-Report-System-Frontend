import { Link } from "react-router-dom";
import {
  Activity,
  BarChart2,
  ListOrdered,
  Navigation,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Split GIS Command HUD:
 * 1. Top-Left: Operational Tools (Fit Zone, Analytics link to /staff, Dispatch Queue toggle, Refresh)
 * 2. Bottom-Left: Information Box (YESC - GIS Cockpit identity, Live status, SLA breach alert, and tagline)
 */
export default function StaffCommandHeader({
  departmentName,
  analytics,
  filterCounts,
  isQueueOpen,
  onToggleQueue,
  onFitMap,
  onRefresh,
  isRefreshing,
}) {
  const { t } = useLanguage();

  const breachedCount = analytics?.sla?.breachedCount ?? 0;
  const atRiskCount = analytics?.sla?.atRiskCount ?? 0;
  const totalTickets = filterCounts?.all ?? 0;

  return (
    <>
      {/* 1. TOP-LEFT: Operational Action Tools */}
      <div className="pointer-events-auto absolute top-3 sm:top-5 left-3 sm:left-5 z-[500] flex items-center gap-2 rounded-2xl border border-console-border bg-surface/95 backdrop-blur-md px-3 py-2 shadow-xl animate-in fade-in-50 duration-150">
        {/* Recenter Map Button */}
        <button
          type="button"
          onClick={onFitMap}
          title={t("Frame Department Zone")}
          className="flex items-center gap-1.5 rounded-xl border border-console-border/70 bg-surface px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:bg-surface-muted active:scale-95"
        >
          <Navigation className="size-3.5 text-brand" />
          <span className="hidden sm:inline">{t("Fit Zone")}</span>
        </button>

        {/* Analytics Link (Navigates directly to /staff dashboard) */}
        <Link
          to="/staff"
          title={t("View Department Analytics & Dashboard")}
          className="flex items-center gap-1.5 rounded-xl border border-console-border/70 bg-surface px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:bg-surface-muted active:scale-95"
        >
          <BarChart2 className="size-3.5 text-brand" />
          <span>{t("Analytics")}</span>
        </Link>

        {/* Triage & Dispatch Queue Toggle Button */}
        <button
          type="button"
          onClick={onToggleQueue}
          aria-pressed={isQueueOpen}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 shadow-xs",
            isQueueOpen
              ? "bg-brand text-white shadow-md hover:bg-brand-hover"
              : "border border-console-border/70 bg-surface text-ink hover:bg-surface-muted"
          )}
        >
          <ListOrdered className="size-3.5" />
          <span>{t("Dispatch Queue")}</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums",
              isQueueOpen
                ? "bg-white/20 text-white"
                : "bg-brand/15 text-brand"
            )}
          >
            {totalTickets}
          </span>
        </button>

        {/* Manual Data Refetch Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          title={t("Refresh Telemetry")}
          className="flex size-8 items-center justify-center rounded-xl border border-console-border/70 bg-surface text-ink-muted shadow-xs transition-colors hover:bg-surface-muted hover:text-ink disabled:opacity-50 active:scale-95"
        >
          <RefreshCw
            className={cn(
              "size-3.5 text-ink",
              isRefreshing && "animate-spin text-brand"
            )}
          />
        </button>
      </div>

      {/* 2. BOTTOM-LEFT: Identity & SLA Telemetry Info Box */}
      <div className="pointer-events-auto absolute bottom-4 left-4 z-[500] max-w-sm sm:max-w-md rounded-2xl border border-console-border bg-surface/95 backdrop-blur-md p-3.5 shadow-xl animate-in fade-in-50 duration-200">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand shadow-inner mt-0.5">
            <Activity className="size-4.5 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Title, Live Pulse & SLA Breach Count Together */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-sm font-bold tracking-tight text-ink truncate">
                {departmentName
                  ? `${departmentName} — ${t("GIS Cockpit")}`
                  : t("GIS Operations Cockpit")}
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                {t("Live")}
              </span>

              {/* SLA Breach Count Badge */}
              {breachedCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400 shrink-0 animate-in fade-in">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span>
                    {breachedCount} {t("SLA Breached")}
                  </span>
                </span>
              ) : atRiskCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 animate-in fade-in">
                  <Clock className="size-3.5 shrink-0" />
                  <span>
                    {atRiskCount} {t("At-Risk")}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>{t("All SLAs On-Track")}</span>
                </span>
              )}
            </div>

            {/* Subtitle / Tag Line */}
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              {t("Real-time municipal dispatch, crew triage, and spatial GIS routing")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
