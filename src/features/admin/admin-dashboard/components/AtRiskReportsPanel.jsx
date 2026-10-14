import { Link } from "react-router-dom";
import { AlertCircle, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import PriorityBadge from "@/components/common/PriorityBadge";
import StatusBadge from "@/components/common/StatusBadge";
import { categoryIcon } from "@/lib/categoryIcons";
import { cn, formatDuration } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Immediate escalation queue highlighting tickets nearing or past SLA thresholds.
 */
export default function AtRiskReportsPanel({ reports = [] }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight text-ink flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-rose-500 animate-pulse" />
            {t("At-Risk & Overdue Incidents")}
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            {t("Immediate administrative escalation queue for tickets approaching or past SLA window")}
          </p>
        </div>
        <Link
          to="/admin/reports?status=IN_PROGRESS"
          className="text-xs font-medium text-brand hover:underline shrink-0"
        >
          {t("View all active")}
        </Link>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-console-border/50">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-ink-muted">
            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
              <ShieldCheck className="size-5" />
            </div>
            <span className="font-semibold text-ink">{t("Zero SLA Breaches")}</span>
            <span className="mt-0.5 text-ink-muted/80">{t("All active tickets are within target municipal resolution windows.")}</span>
          </div>
        ) : (
          reports.slice(0, 5).map((r) => {
            const CatIcon = categoryIcon(r);
            const isBreached = r.sla?.status === "BREACHED";

            return (
              <div
                key={r.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3 transition-colors hover:bg-surface-muted/30 -mx-2 px-2 rounded-lg"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-console-border bg-surface-muted/60 mt-0.5">
                    <CatIcon className="size-4" style={{ color: r.categoryColor ?? undefined }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/reports/${r.id}`}
                        className="truncate text-[13px] font-semibold text-ink hover:text-brand"
                      >
                        {r.title}
                      </Link>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                      <span className="font-mono text-[11px]">{r.reportCode}</span>
                      <span>·</span>
                      <span className="truncate">{r.categoryName}</span>
                      {r.departmentName && (
                        <>
                          <span>·</span>
                          <span className="truncate font-medium">{r.departmentName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <PriorityBadge priority={r.priority} />
                  <StatusBadge status={r.status} />

                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold",
                      isBreached
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    )}
                  >
                    <Clock className="size-3" />
                    <span>
                      {isBreached
                        ? `+${formatDuration(r.sla?.overdueHours)} overdue`
                        : `${formatDuration(r.sla?.elapsedHours)} elapsed`}
                    </span>
                  </div>

                  <Link
                    to={`/admin/reports/${r.id}`}
                    className="flex size-7 items-center justify-center rounded-md border border-console-border text-ink-muted hover:border-brand hover:text-brand hover:bg-surface-muted transition-colors"
                    title={t("Open ticket detail")}
                  >
                    <ArrowRight className="size-3.5" />
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
