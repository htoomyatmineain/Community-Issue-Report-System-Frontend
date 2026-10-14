import { Link } from "react-router-dom";
import {
  X,
  ExternalLink,
  MapPin,
  Clock,
  AlertTriangle,
  User,
  ShieldCheck,
  Calendar,
  Crosshair,
} from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import PriorityBadge from "@/components/common/PriorityBadge";
import { categoryIcon } from "@/lib/categoryIcons";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn, formatDuration } from "@/lib/utils";
import { evaluateStaffReportSla } from "../lib/staffAnalytics";

/**
 * Rich interactive pop-up card that appears when a pin or report is selected on the map.
 * Gives decision-makers all immediate context, SLA timer, and dispatch access.
 */
export default function StaffReportInspector({ report, onClose, onCenterOnMap }) {
  const { t } = useLanguage();

  if (!report) return null;

  const CatIcon = categoryIcon(report);
  const sla = report.sla || evaluateStaffReportSla(report);

  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  const thumbnail =
    report.images?.[0]?.thumbnailUrl ||
    report.images?.[0]?.imageUrl ||
    report.thumbnailUrl ||
    report.imageUrl;

  return (
    <aside
      aria-label={t("Report Inspector")}
      className="pointer-events-auto absolute top-20 left-3 right-3 sm:left-5 sm:right-auto sm:w-[420px] z-[550] flex flex-col rounded-2xl border border-console-border bg-surface p-4 shadow-xl animate-in fade-in-50 slide-in-from-top-3 duration-200"
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-console-border/60">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold text-ink-muted bg-surface-muted/80 px-2 py-0.5 rounded-md border border-console-border/60">
            {report.reportCode}
          </span>
          <StatusBadge status={report.status} />
          <PriorityBadge priority={report.priority} />
        </div>

        <div className="flex items-center gap-1">
          {onCenterOnMap && (
            <button
              type="button"
              onClick={onCenterOnMap}
              title={t("Center on Map")}
              className="rounded-lg p-1 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink active:scale-95"
            >
              <Crosshair className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close")}
            className="rounded-lg p-1 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* SLA Operational Deadline Banner */}
      <div
        className={cn(
          "my-2.5 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium border",
          sla.status === "BREACHED" &&
            "bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400",
          sla.status === "AT_RISK" &&
            "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400",
          sla.status === "ON_TRACK" &&
            "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400",
          sla.status === "COMPLETED" &&
            "bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400"
        )}
      >
        <div className="flex items-center gap-2">
          {sla.status === "BREACHED" ? (
            <AlertTriangle className="size-4 shrink-0 animate-bounce" />
          ) : (
            <Clock className="size-4 shrink-0" />
          )}
          <span>
            {sla.status === "BREACHED" && `${t("SLA Breached")} (${formatDuration(sla.overdueHours)} ${t("overdue")})`}
            {sla.status === "AT_RISK" && `${t("At Risk")} (${formatDuration(sla.remainingHours)} ${t("remaining")})`}
            {sla.status === "ON_TRACK" && `${t("SLA On-Track")} (${formatDuration(sla.remainingHours)} ${t("left")})`}
            {sla.status === "COMPLETED" && t("SLA Target Fulfilled")}
          </span>
        </div>
        <span className="font-mono text-[11px] font-semibold opacity-85">
          {sla.targetHours}h {t("Target")}
        </span>
      </div>

      {/* Main Content Area: Photo Preview + Title */}
      <div className="flex gap-3">
        {thumbnail ? (
          <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-console-border bg-surface-muted">
            <img
              src={thumbnail}
              alt={report.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-console-border bg-surface-muted/60 text-ink-muted">
            <CatIcon className="size-8" style={{ color: report.categoryColor ?? "var(--brand)" }} />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted mb-0.5">
              <CatIcon className="size-3.5 shrink-0" style={{ color: report.categoryColor ?? "var(--brand)" }} />
              <span className="truncate">{report.categoryName}</span>
            </div>
            <h2 className="font-display text-sm font-bold tracking-tight text-ink line-clamp-2">
              {report.title}
            </h2>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-ink-muted truncate mt-1">
            <MapPin className="size-3 shrink-0 text-brand" />
            <span className="truncate">{report.addressText || t("Location coordinates tagged")}</span>
          </div>
        </div>
      </div>

      {/* Metadata Pill Row */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink-muted pt-2 border-t border-console-border/50">
        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="size-3.5 shrink-0" />
          <span className="truncate text-[11px]">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <User className="size-3.5 shrink-0" />
          <span className="truncate text-[11px]">
            {report.anonymous ? t("Anonymous Citizen") : report.reporterName || t("Citizen")}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-3.5 pt-1">
        <Link
          to={`/staff/reports/${report.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-hover active:scale-[0.98]"
        >
          <span>{t("Open Full Report & Dispatch")}</span>
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
