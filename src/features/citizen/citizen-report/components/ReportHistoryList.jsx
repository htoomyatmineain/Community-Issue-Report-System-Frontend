import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { useReportHistory } from "../hooks/useReportHistory";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function ReportHistoryList() {
  const { t } = useLanguage();
  const { reports, isLoading, error } = useReportHistory();

  if (isLoading) return <p className="py-6 text-sm text-muted-foreground">{t("Loading…")}</p>;
  if (error) return <p className="py-6 text-sm text-destructive">{error}</p>;
  if (!reports.length) {
    return (
      <EmptyState
        title="No reports yet"
        description="Issues you report will show up here with their status and history."
      />
    );
  }

  return (
    <ul>
      {reports.map((report) => (
        <li key={report.id} className="border-b border-border last:border-0">
          <Link to={`/report/${report.id}`} className="flex flex-col gap-2 py-3">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[13px] font-semibold text-foreground">{report.title}</span>
              <StatusBadge status={report.status} />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {report.categoryName} · {report.reportCode} · {formatDateTime(report.createdAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
