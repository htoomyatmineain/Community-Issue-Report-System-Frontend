import { Link } from "react-router-dom";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

const COLUMNS = [
  { key: "code", header: "Code", width: "w-[100px]" },
  { key: "title", header: "Title", width: "flex-1" },
  { key: "category", header: "Category", width: "w-[140px]" },
  { key: "status", header: "Status", width: "w-[150px]" },
  { key: "reported", header: "Reported", width: "w-[120px]" },
];

/** Recent reports table on the staff dashboard — GET /api/dashboard/staff. */
export default function RecentReportsTable({ reports }) {
  return (
    <div className="rounded-console border border-console-border bg-surface p-4">
      <h2 className="px-1 py-2 font-display text-base font-bold text-ink">Recent reports</h2>

      {!reports?.length ? (
        <EmptyState title="No reports yet" description="Reports in your department will show up here." />
      ) : (
        <>
          <div className="flex border-b border-console-border px-1 py-2.5">
            {COLUMNS.map((col) => (
              <div key={col.key} className={col.width}>
                <span className="text-xs font-bold text-ink-muted">{col.header}</span>
              </div>
            ))}
          </div>

          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/staff/reports/${report.id}`}
              className="flex items-center border-b border-console-border px-1 py-3 last:border-0 hover:bg-surface-muted"
            >
              <div className="w-[100px] text-[13px] font-semibold text-ink">{report.reportCode}</div>
              <div className="flex-1 truncate pr-4 text-[13px] text-ink">{report.title}</div>
              <div className="w-[140px] truncate text-[13px] text-ink-muted">{report.categoryName}</div>
              <div className="w-[150px]">
                <StatusBadge status={report.status} />
              </div>
              <div className="w-[120px] text-[13px] text-ink-muted">{formatDate(report.createdAt)}</div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
