import { useMemo } from "react";
import { Star } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import SimplePieChart from "@/components/common/SimplePieChart";
import SimpleBarChart from "@/components/common/SimpleBarChart";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useStaffDepartments } from "../hooks/useStaffDepartments";

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
  const { departments, isLoading, error } = useStaffDepartments();

  const workloadShare = useMemo(
    () =>
      departments.map((d) => ({
        departmentName: d.departmentName,
        workload: (d.openCount ?? 0) + (d.inProgressCount ?? 0),
      })),
    [departments]
  );
  const monthlyVolume = useMemo(() => aggregateMonthlyVolume(departments), [departments]);

  return (
    <div>
      <PageHeader title="Departments" description="Workload and performance across every department." />

      {error ? (
        <div className="rounded-console border border-console-border bg-surface p-6 text-sm text-destructive">
          {error}
        </div>
      ) : isLoading ? (
        <div className="rounded-console border border-console-border bg-surface p-6 text-sm text-ink-muted">
          Loading departments…
        </div>
      ) : departments.length === 0 ? (
        <div className="rounded-console border border-console-border bg-surface">
          <EmptyState title="No departments yet" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4">
            {departments.map((dept) => (
              <div
                key={dept.departmentId}
                className="min-w-[180px] flex-1 rounded-console border border-console-border bg-surface p-5"
              >
                <h3 className="font-display text-sm font-bold text-ink">{dept.departmentName}</h3>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <dt className="text-xs text-ink-muted">Open</dt>
                    <dd className="font-display text-lg font-bold text-status-pending">{dept.openCount ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">In progress</dt>
                    <dd className="font-display text-lg font-bold text-status-progress">{dept.inProgressCount ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Resolved</dt>
                    <dd className="font-display text-lg font-bold text-status-resolved">{dept.resolvedCount ?? 0}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
              <h2 className="font-display text-base font-bold text-ink">Workload share</h2>
              <div className="mt-4">
                <SimplePieChart data={workloadShare} nameKey="departmentName" valueKey="workload" />
              </div>
            </div>

            <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
              <h2 className="font-display text-base font-bold text-ink">Monthly volume</h2>
              <div className="mt-4">
                <SimpleBarChart data={monthlyVolume} xKey="month" yKey="reportCount" color="var(--status-progress)" />
              </div>
            </div>
          </div>

          <div className="rounded-console border border-console-border bg-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Avg. resolution time</TableHead>
                  <TableHead>Avg. citizen rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.departmentId}>
                    <TableCell className="font-medium text-ink">{dept.departmentName}</TableCell>
                    <TableCell className="text-ink-muted">
                      {dept.avgResolutionHours != null ? `${dept.avgResolutionHours.toFixed(1)} hrs` : "—"}
                    </TableCell>
                    <TableCell className="text-ink-muted">
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
