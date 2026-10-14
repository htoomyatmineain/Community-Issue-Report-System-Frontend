import { useMemo } from "react";
import { Star } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import SimplePieChart from "@/components/common/SimplePieChart";
import SimpleBarChart from "@/components/common/SimpleBarChart";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useStaffDepartments } from "../hooks/useStaffDepartments";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** Sums each department's monthly series into one system-wide series, keyed by month order (all departments share the same window). */
function aggregateMonthlyVolume(departments) {
  const byMonth = new Map();
  for (const dept of departments) {
    for (const { month, reportCount } of dept.monthlyVolume ?? []) {
      byMonth.set(month, (byMonth.get(month) ?? 0) + reportCount);
    }
  }
  return [...byMonth.entries()].map(([month, reportCount]) => ({ month, reportCount }));
}

/** Departments workload & performance page (ui-rules.md "Departments Page") — shared by Admin and Staff. */
export default function StaffDepartmentsPage() {
  const { t } = useLanguage();
  const { departments, isLoading, error } = useStaffDepartments();

  const workloadShare = useMemo(
    () =>
      departments.map((d) => ({
        departmentName: t(d.departmentName),
        workload: (d.openCount ?? 0) + (d.inProgressCount ?? 0),
      })),
    [departments, t]
  );
  const monthlyVolume = useMemo(() => aggregateMonthlyVolume(departments), [departments]);

  return (
    <div>
      <PageHeader title="Departments" description="Workload and performance across every department." />

      {error ? (
        <div className="rounded-xl border border-console-border/70 bg-surface p-6 text-sm text-destructive">
          {error}
        </div>
      ) : isLoading ? (
        <div className="rounded-xl border border-console-border/70 bg-surface p-6 text-sm text-ink-muted">
          {t("Loading departments…")}
        </div>
      ) : departments.length === 0 ? (
        <div className="rounded-xl border border-console-border/70 bg-surface p-6">
          <EmptyState title="No departments yet" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4">
            {departments.map((dept) => (
              <div
                key={dept.departmentId}
                className="min-w-[180px] flex-1 rounded-xl border border-console-border/70 bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <h3 className="font-display text-sm font-semibold tracking-tight text-ink">{t(dept.departmentName)}</h3>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <dt className="text-xs text-ink-muted">{t("Open")}</dt>
                    <dd className="font-display text-lg font-semibold tabular-nums text-status-pending">{dept.openCount ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">{t("In progress")}</dt>
                    <dd className="font-display text-lg font-semibold tabular-nums text-status-progress">{dept.inProgressCount ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">{t("Resolved")}</dt>
                    <dd className="font-display text-lg font-semibold tabular-nums text-status-resolved">{dept.resolvedCount ?? 0}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col">
              <h2 className="font-display text-sm font-semibold tracking-tight text-ink">{t("Workload share")}</h2>
              <div className="mt-4 flex-1 flex flex-col justify-center">
                <SimplePieChart data={workloadShare} nameKey="departmentName" valueKey="workload" />
              </div>
            </div>

            <div className="rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col">
              <h2 className="font-display text-sm font-semibold tracking-tight text-ink">{t("Monthly volume")}</h2>
              <div className="mt-4 flex-1 flex flex-col justify-center">
                <SimpleBarChart data={monthlyVolume} xKey="month" yKey="reportCount" color="var(--status-progress)" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Department")}</TableHead>
                  <TableHead>{t("Avg. resolution time")}</TableHead>
                  <TableHead>{t("Avg. citizen rating")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.departmentId}>
                    <TableCell className="font-medium text-ink tracking-tight">{t(dept.departmentName)}</TableCell>
                    <TableCell className="text-xs text-ink-muted tabular-nums">
                      {dept.avgResolutionHours != null ? `${dept.avgResolutionHours.toFixed(1)} hrs` : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-ink-muted tabular-nums">
                      {dept.avgRating != null ? (
                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3.5 fill-amber-500 text-amber-500" />
                          {dept.avgRating.toFixed(1)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
