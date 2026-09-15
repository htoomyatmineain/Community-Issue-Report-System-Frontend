import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—";

/** Admin dashboard panel — reports awaiting approval, each linking to its report detail page to approve/deny. */
export default function ReportsAwaitingApprovalPanel({ reports }) {
  return (
    <div className="flex-1 rounded-console border border-console-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink">Reports awaiting approval</h2>
        <Link to="/admin/report-approvals" className="text-xs font-semibold text-brand hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-4">
        {!reports?.length ? (
          <EmptyState title="No reports waiting" description="New citizen reports will show up here." />
        ) : (
          <ul>
            {reports.map((report) => (
              <li
                key={report.id}
                className="flex items-center justify-between gap-3 border-b border-console-border py-3 last:border-0"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-semibold text-ink">{report.title}</span>
                  <span className="truncate text-xs text-ink-muted">
                    {report.categoryName} · {formatDate(report.createdAt)}
                  </span>
                </div>
                <Button asChild size="sm" variant="outline" className="shrink-0">
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
