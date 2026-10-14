import { Link } from "react-router-dom";
import { AlertTriangle, Clock, CheckCircle2, ArrowRight, ShieldAlert } from "lucide-react";
import PriorityBadge from "@/components/common/PriorityBadge";
import StatusBadge from "@/components/common/StatusBadge";
import { categoryIcon } from "@/lib/categoryIcons";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn, formatDuration } from "@/lib/utils";

/**
 * Immediate Escalation Queue for SLA-Breached & At-Risk Reports.
 * Provides department officials with an actionable dispatch list of time-sensitive tickets.
 */
export default function StaffEscalationPanel({ reports = [] }) {
  const { t } = useLanguage();

  const escalatedReports = reports.filter(
    (r) => r.sla?.status === "BREACHED" || r.sla?.status === "AT_RISK" || r.priority === "URGENT"
  );

  return (
    <div className="flex flex-col rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-console-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="size-4" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold tracking-tight text-ink">
              {t("Immediate Action & Escalation Queue")}
            </h2>
            <p className="text-xs text-ink-muted">
              {t("Tickets breached or approaching municipal SLA resolution deadlines")}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums border",
            escalatedReports.length > 0
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          )}
        >
          {escalatedReports.length} {t("Requiring Action")}
        </span>
      </div>

      {/* Reports List */}
      <div className="mt-3 divide-y divide-console-border/40">
        {escalatedReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-ink-muted">
            <CheckCircle2 className="size-8 text-emerald-500 mb-2 stroke-[1.5]" />
            <span className="font-semibold text-ink">{t("All Department SLAs Compliant")}</span>
            <span className="text-[11px] mt-0.5">{t("No tickets are currently breached or approaching deadline.")}</span>
          </div>
        ) : (
          escalatedReports.slice(0, 5).map((report) => {
            const CatIcon = categoryIcon(report);
            const sla = report.sla;

            return (
              <div
                key={report.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 transition-colors hover:bg-surface-muted/30 -mx-2 px-2 rounded-lg"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-brand mt-0.5">
                    <CatIcon className="size-3.5" style={{ color: report.categoryColor ?? "var(--brand)" }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink-muted">{report.reportCode}</span>
                      <PriorityBadge priority={report.priority} />
                      <StatusBadge status={report.status} />
                    </div>

                    <h3 className="truncate text-[13px] font-semibold text-ink mt-0.5 group-hover:text-brand">
                      {report.title}
                    </h3>
                  </div>
                </div>

                {/* SLA Indicator & Action */}
                <div className="flex items-center gap-3 shrink-0 sm:self-center">
                  {sla && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border",
                        sla.status === "BREACHED" &&
                          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                        sla.status === "AT_RISK" &&
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                        sla.status === "ON_TRACK" &&
                          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      )}
                    >
                      {sla.status === "BREACHED" ? (
                        <>
                          <AlertTriangle className="size-3 shrink-0" />
                          <span>{formatDuration(sla.overdueHours)} {t("overdue")}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="size-3 shrink-0" />
                          <span>{formatDuration(sla.remainingHours)} {t("left")}</span>
                        </>
                      )}
                    </span>
                  )}

                  <Link
                    to={`/staff/reports/${report.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-console-border bg-surface px-2.5 py-1 text-xs font-semibold text-ink shadow-xs transition-colors hover:bg-surface-muted hover:text-brand active:scale-95"
                  >
                    <span>{t("Dispatch")}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
