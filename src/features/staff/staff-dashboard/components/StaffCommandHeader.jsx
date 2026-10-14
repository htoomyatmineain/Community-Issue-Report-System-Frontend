import {
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
 * Streamlined GIS Command HUD (Zero Glassmorphism):
 * 1. Top-Left: Live & SLA Breached Telemetry Status Bar
 * 2. Top-Right: Operational Action Tools (Fit Zone, Dispatch Queue toggle, Refresh) docked on top of the dispatch drawer
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
      {/* 1. TOP-LEFT: Live Status & SLA Breached Alert (Solid surface, zero glassmorphism) */}
      <div className="pointer-events-auto absolute top-3 sm:top-4 left-3 sm:left-4 z-[500] flex items-center gap-2 rounded-2xl border border-console-border bg-surface px-3 py-2 shadow-xl animate-in fade-in-50 duration-150 select-none">
        {departmentName && (
          <span className="font-display text-xs font-bold tracking-tight text-ink truncate mr-0.5">
            {departmentName}
          </span>
        )}

        {/* Live Status Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
          {t("Live")}
        </span>

        {/* SLA Breach Count Badge */}
        {breachedCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400 shrink-0 animate-in fade-in">
            <AlertTriangle className="size-3.5 shrink-0 text-rose-500" />
            <span>
              {breachedCount} {t("SLA Breached")}
            </span>
          </span>
        ) : atRiskCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 animate-in fade-in">
            <Clock className="size-3.5 shrink-0 text-amber-500" />
            <span>
              {atRiskCount} {t("At-Risk")}
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
            <span>{t("All SLAs On-Track")}</span>
          </span>
        )}
      </div>

      {/* 2. TOP-RIGHT: Operational Action Tools Docked Directly Above the Dispatch Drawer */}
      <div className="pointer-events-auto absolute top-3 sm:top-4 right-3 sm:right-4 z-[530] flex items-center gap-2 rounded-2xl border border-console-border bg-surface px-3 py-2 shadow-xl animate-in fade-in-50 duration-150">
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
    </>
  );
}
