import { Link } from "react-router-dom";
import { Building2, Star, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Department Workload & Operational Capacity Balance Panel.
 * Enables administration to spot bottlenecks and rebalance municipal resources.
 */
export default function DepartmentWorkloadPanel({ departments = [] }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight text-ink">
            {t("Department Workload & Capacity Balance")}
          </h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            {t("Active ticket distribution, resolution speed, and public rating by municipal agency")}
          </p>
        </div>
        <Link
          to="/admin/departments"
          className="text-xs font-medium text-brand hover:underline shrink-0"
        >
          {t("Manage all")}
        </Link>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-console-border/50">
        {departments.length === 0 ? (
          <p className="py-6 text-center text-xs text-ink-muted">{t("No department metrics available.")}</p>
        ) : (
          departments.map((dept) => {
            const isHighLoad = dept.workloadStatus === "HIGH_LOAD" || dept.workloadStatus === "CRITICAL_LOAD";

            return (
              <div
                key={dept.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 transition-colors hover:bg-surface-muted/30 -mx-2 px-2 rounded-lg"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-console-border bg-surface-muted/60 text-ink-muted mt-0.5">
                    <Building2 className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/reports?departmentId=${dept.id}`}
                        className="truncate text-[13px] font-semibold text-ink hover:text-brand"
                      >
                        {dept.name}
                      </Link>
                      {isHighLoad && (
                        <span className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {t("Heavy Load")}
                        </span>
                      )}
                    </div>

                    {/* Workload load progress bar */}
                    <div className="mt-1.5 flex items-center gap-2.5">
                      <div className="h-1.5 flex-1 max-w-[140px] rounded-full bg-surface-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            isHighLoad ? "bg-amber-500" : "bg-brand"
                          )}
                          style={{ width: `${Math.min(100, Math.max(5, dept.shareOfOpenLoad))}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-ink-muted tabular-nums">
                        {dept.shareOfOpenLoad}% {t("of active load")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs">
                  <div className="text-right">
                    <span className="block font-semibold text-ink tabular-nums">
                      {dept.openCount} {t("active")}
                    </span>
                    <span className="block text-[11px] text-ink-muted tabular-nums">
                      {dept.resolvedCount} {t("resolved")}
                    </span>
                  </div>

                  {dept.averageResolutionHours && (
                    <div className="hidden md:flex items-center gap-1 font-mono text-[11px] text-ink-muted">
                      <Clock className="size-3 text-ink-muted/70" />
                      <span>{dept.averageResolutionHours}h</span>
                    </div>
                  )}

                  {dept.averageRating && (
                    <div className="flex items-center gap-1 rounded-md border border-console-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span>{dept.averageRating}</span>
                    </div>
                  )}

                  <Link
                    to={`/admin/reports?departmentId=${dept.id}`}
                    className="text-ink-muted/60 hover:text-brand transition-colors p-1"
                    title={t("Filter reports for this department")}
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
