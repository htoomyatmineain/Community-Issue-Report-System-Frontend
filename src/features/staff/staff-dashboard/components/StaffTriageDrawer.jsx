import { useState, useMemo } from "react";
import {
  X,
  AlertTriangle,
  Clock,
  MapPin,
  Flame,
  ChevronRight,
  ChevronDown,
  Search,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import PriorityBadge from "@/components/common/PriorityBadge";
import { categoryIcon } from "@/lib/categoryIcons";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn, formatDuration } from "@/lib/utils";

/**
 * Priority-Ranked GIS Dispatch & Triage Queue Drawer.
 * Groups tickets into 3 sequential, actionable tiers:
 * 1. 🚨 Critical & SLA Breached (Immediate dispatch required)
 * 2. ⚡ Ready for Dispatch (Awaiting crew assignment / approaching deadline)
 * 3. 🚙 Active In Field (Crews currently operating on site)
 */
export default function StaffTriageDrawer({
  isOpen,
  onClose,
  reports = [],
  selectedReportId,
  onSelectReport,
}) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(null); // null (shows all tiers) | "CRITICAL" | "AWAITING" | "FIELD"

  // Collapsible section state (all expanded by default for full visibility)
  const [sectionsOpen, setSectionsOpen] = useState({
    critical: true,
    awaiting: true,
    field: true,
  });

  const toggleSection = (sectionKey) => {
    setSectionsOpen((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleTabClick = (tabKey) => {
    setActiveTab((prev) => (prev === tabKey ? null : tabKey));
  };

  // Filter reports by search query
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = r.reportCode?.toLowerCase().includes(q);
        const matchesTitle = r.title?.toLowerCase().includes(q);
        const matchesCat = r.categoryName?.toLowerCase().includes(q);
        const matchesAddr = r.addressText?.toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle && !matchesCat && !matchesAddr) return false;
      }
      return true;
    });
  }, [reports, searchQuery]);

  // Group into 3 Actionable Tiers
  const { criticalReports, awaitingReports, fieldReports, otherReports } = useMemo(() => {
    const critical = [];
    const awaiting = [];
    const field = [];
    const other = [];

    filteredReports.forEach((r) => {
      const isBreached = r.sla?.status === "BREACHED";
      const isUrgent = r.priority === "URGENT";

      if (isBreached || isUrgent) {
        critical.push(r);
      } else if (r.status === "IN_PROGRESS") {
        field.push(r);
      } else if (
        r.status === "ASSIGNED" ||
        r.status === "PENDING_APPROVAL" ||
        r.sla?.status === "AT_RISK"
      ) {
        awaiting.push(r);
      } else {
        other.push(r);
      }
    });

    return {
      criticalReports: critical,
      awaitingReports: awaiting,
      fieldReports: field,
      otherReports: other,
    };
  }, [filteredReports]);

  if (!isOpen) return null;

  const renderReportCard = (report) => {
    const isSelected = report.id === selectedReportId;
    const CatIcon = categoryIcon(report);
    const sla = report.sla;

    return (
      <div
        key={report.id}
        onClick={() => onSelectReport(report)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onSelectReport(report)}
        className={cn(
          "group flex flex-col gap-1.5 rounded-xl p-2.5 text-left transition-all duration-150 cursor-pointer active:scale-[0.99] border",
          isSelected
            ? "bg-brand/10 border-brand/50 shadow-xs"
            : "border-console-border/40 bg-surface hover:border-console-border hover:bg-surface-muted/60"
        )}
      >
        {/* Top Line: Code, Priority, SLA countdown badge */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-ink-muted">
              {report.reportCode}
            </span>
            <PriorityBadge priority={report.priority} />
          </div>

          {sla && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                sla.status === "BREACHED" &&
                  "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25",
                sla.status === "AT_RISK" &&
                  "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25",
                sla.status === "ON_TRACK" &&
                  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
              )}
            >
              {sla.status === "BREACHED" ? (
                <>
                  <AlertTriangle className="size-2.5 shrink-0" />
                  <span>{formatDuration(sla.overdueHours)} overdue</span>
                </>
              ) : (
                <>
                  <Clock className="size-2.5 shrink-0" />
                  <span>{formatDuration(sla.remainingHours)} left</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Title, Category & Location */}
        <div className="flex items-start gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-surface-muted/90 text-brand mt-0.5">
            <CatIcon className="size-3.5" style={{ color: report.categoryColor ?? "var(--brand)" }} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-semibold text-ink group-hover:text-brand transition-colors">
              {report.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-ink-muted truncate mt-0.5">
              <MapPin className="size-2.5 text-brand shrink-0" />
              <span className="truncate">{report.addressText || report.categoryName}</span>
            </div>
          </div>
          <ChevronRight className="size-4 shrink-0 text-ink-muted/50 group-hover:text-brand group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    );
  };

  return (
    <aside
      aria-label={t("Dispatch Queue")}
      className="pointer-events-auto absolute bottom-4 right-3 top-20 z-[520] flex w-[350px] sm:w-[390px] flex-col rounded-2xl border border-console-border bg-surface shadow-2xl animate-in fade-in-50 slide-in-from-right-5 duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-console-border/70 p-4 pb-3 bg-surface-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-brand/15 text-brand shadow-inner">
            <Flame className="size-4" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold tracking-tight text-ink">
              {t("Dispatch & Triage Queue")}
            </h2>
            <p className="text-[11px] text-ink-muted">
              {t("Ranked by urgency & SLA resolution deadline")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand/15 px-2 py-0.5 font-mono text-xs font-bold text-brand tabular-nums">
            {filteredReports.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close Queue")}
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Search Input & Tier Filter Pills (No "All" pill) */}
      <div className="p-3 pb-2 border-b border-console-border/40">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Filter by code, title or location…")}
            className="w-full rounded-xl border border-console-border bg-surface-muted/60 py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        {/* Quick Filter Pill Buttons — Without "All" button */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-none text-[11px]">
          <button
            type="button"
            onClick={() => handleTabClick("CRITICAL")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all active:scale-95 shrink-0",
              activeTab === "CRITICAL"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
            )}
          >
            <AlertTriangle className="size-3" />
            <span>{t("Critical ({count})", { count: criticalReports.length })}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("AWAITING")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all active:scale-95 shrink-0",
              activeTab === "AWAITING"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
            )}
          >
            <Clock className="size-3" />
            <span>{t("Queued ({count})", { count: awaitingReports.length })}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("FIELD")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all active:scale-95 shrink-0",
              activeTab === "FIELD"
                ? "bg-brand text-white shadow-xs"
                : "bg-brand/10 text-brand hover:bg-brand/20"
            )}
          >
            <Wrench className="size-3" />
            <span>{t("Field ({count})", { count: fieldReports.length })}</span>
          </button>
        </div>
      </div>

      {/* Queue Body: Priority Grouped Accordion Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-ink-muted">
            <CheckCircle2 className="size-8 text-emerald-500 mb-2 stroke-[1.5]" />
            <span className="font-semibold text-ink">{t("No tickets match your filter")}</span>
            <span className="text-[11px] mt-0.5">{t("All tickets are currently dispatched or resolved.")}</span>
          </div>
        ) : (
          <>
            {/* TIER 1: 🚨 Critical & SLA Breached */}
            {(!activeTab || activeTab === "CRITICAL") && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-2.5">
                <button
                  type="button"
                  onClick={() => toggleSection("critical")}
                  className="flex w-full items-center justify-between text-left mb-1.5 focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="size-3" />
                    </span>
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400 tracking-wide uppercase">
                      {t("1. Critical & Breached SLAs")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                      {criticalReports.length}
                    </span>
                    {sectionsOpen.critical ? (
                      <ChevronDown className="size-3.5 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <ChevronRight className="size-3.5 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                </button>

                {sectionsOpen.critical && (
                  <div className="space-y-2 mt-2">
                    {criticalReports.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-rose-500/30 p-3 text-center text-[11px] text-ink-muted">
                        {t("No breached or urgent tickets currently active.")}
                      </div>
                    ) : (
                      criticalReports.map((r) => renderReportCard(r))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TIER 2: ⚡ Awaiting Dispatch (Ready for Assignment) */}
            {(!activeTab || activeTab === "AWAITING") && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-2.5">
                <button
                  type="button"
                  onClick={() => toggleSection("awaiting")}
                  className="flex w-full items-center justify-between text-left mb-1.5 focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      <Clock className="size-3" />
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wide uppercase">
                      {t("2. Ready for Dispatch")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                      {awaitingReports.length}
                    </span>
                    {sectionsOpen.awaiting ? (
                      <ChevronDown className="size-3.5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <ChevronRight className="size-3.5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                </button>

                {sectionsOpen.awaiting && (
                  <div className="space-y-2 mt-2">
                    {awaitingReports.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-amber-500/30 p-3 text-center text-[11px] text-ink-muted">
                        {t("No pending reports awaiting dispatch.")}
                      </div>
                    ) : (
                      awaitingReports.map((r) => renderReportCard(r))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TIER 3: 🚙 Active In Field (Crews Operating) */}
            {(!activeTab || activeTab === "FIELD") && (
              <div className="rounded-xl border border-brand/30 bg-brand/5 p-2.5">
                <button
                  type="button"
                  onClick={() => toggleSection("field")}
                  className="flex w-full items-center justify-between text-left mb-1.5 focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-md bg-brand/20 text-brand">
                      <Wrench className="size-3" />
                    </span>
                    <span className="text-xs font-bold text-brand tracking-wide uppercase">
                      {t("3. Active In Field")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand/20 px-1.5 py-0.2 text-[10px] font-bold text-brand tabular-nums">
                      {fieldReports.length}
                    </span>
                    {sectionsOpen.field ? (
                      <ChevronDown className="size-3.5 text-brand" />
                    ) : (
                      <ChevronRight className="size-3.5 text-brand" />
                    )}
                  </div>
                </button>

                {sectionsOpen.field && (
                  <div className="space-y-2 mt-2">
                    {fieldReports.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-brand/30 p-3 text-center text-[11px] text-ink-muted">
                        {t("No crews currently dispatched in the field.")}
                      </div>
                    ) : (
                      fieldReports.map((r) => renderReportCard(r))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Other / Unclassified (if any) */}
            {otherReports.length > 0 && !activeTab && (
              <div className="rounded-xl border border-console-border/70 bg-surface-muted/40 p-2.5">
                <span className="text-xs font-bold text-ink-muted tracking-wide uppercase block mb-2">
                  {t("Other Reports ({count})", { count: otherReports.length })}
                </span>
                <div className="space-y-2">
                  {otherReports.map((r) => renderReportCard(r))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
