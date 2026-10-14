import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—";

/** Admin dashboard panel — reports awaiting approval, each linking to its report detail page to approve/deny. */
export default function ReportsAwaitingApprovalPanel({ reports }) {
  return (
    <div className="flex-1 rounded-xl border border-console-border/70 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold tracking-tight text-ink">Reports awaiting approval</h2>
        <Link to="/admin/report-approvals" className="text-xs font-medium text-brand hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-3">
        {!reports?.length ? (
          <EmptyState title="No reports waiting" description="New citizen reports will show up here." />
        ) : (
          <ul className="divide-y divide-console-border/60">
            {reports.map((report) => (
              <li
                key={report.id}
                className="flex items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-surface-muted/40 transition-colors"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-medium tracking-tight text-ink">{report.title}</span>
                  <span className="truncate text-xs text-ink-muted">
                    {report.categoryName} · {formatDate(report.createdAt)}
                  </span>
                </div>
                <Button asChild size="sm" variant="outline" className="h-7 shrink-0 px-2.5 text-xs rounded-lg active:scale-95">
                  <Link to={`/admin/reports/${report.id}`}>View Detail</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
