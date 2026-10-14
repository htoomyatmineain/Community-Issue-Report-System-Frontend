import { Link } from "react-router-dom";
import StatusBadge from "@/components/common/StatusBadge";
import ReviewTypeBadge from "@/components/common/ReviewTypeBadge";
import EmptyState from "@/components/common/EmptyState";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

const COLUMNS = [
  { key: "code", header: "Code", width: "w-[100px]" },
  { key: "title", header: "Title", width: "flex-1" },
  { key: "category", header: "Category", width: "w-[130px]" },
  { key: "review", header: "Review", width: "w-[120px]" },
  { key: "status", header: "Status", width: "w-[140px]" },
  { key: "reported", header: "Reported", width: "w-[110px]" },
];

/** Recent reports table on the staff dashboard — GET /api/dashboard/staff. */
export default function RecentReportsTable({ reports }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-console-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="border-b border-console-border/70 bg-surface-muted/30 px-5 py-3.5">
        <h2 className="font-display text-sm font-semibold tracking-tight text-ink">{t("Recent reports")}</h2>
      </div>

      {!reports?.length ? (
        <div className="p-6">
          <EmptyState title="No reports yet" description="Reports in your department will show up here." />
        </div>
      ) : (
        <>
          <div className="flex border-b border-console-border/70 bg-surface-muted/20 px-5 py-2.5">
            {COLUMNS.map((col) => (
              <div key={col.key} className={col.width}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted/80 select-none">
                  {t(col.header)}
                </span>
              </div>
            ))}
          </div>

          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/staff/reports/${report.id}`}
              className="flex items-center border-b border-console-border/60 px-5 py-3.5 last:border-b-0 transition-colors duration-150 hover:bg-surface-muted/40"
            >
              <div className="w-[100px] font-mono text-xs font-medium text-ink-muted">{report.reportCode}</div>
              <div className="flex-1 truncate pr-4 text-[13px] font-medium text-ink tracking-tight">{report.title}</div>
              <div className="w-[130px] truncate text-xs text-ink-muted">{report.categoryName}</div>
              <div className="w-[120px]">
                <ReviewTypeBadge report={report} />
              </div>
              <div className="w-[140px]">
                <StatusBadge status={report.status} />
              </div>
              <div className="w-[110px] text-xs text-ink-muted tabular-nums">{formatDate(report.createdAt)}</div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
