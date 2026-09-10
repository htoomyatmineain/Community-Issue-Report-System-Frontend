import { useState } from "react";
import { Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import StatusBadge from "@/components/common/StatusBadge";
import StatusTimeline from "@/components/common/StatusTimeline";
import { useReportDetail } from "../hooks/useReportDetail";
import FeedbackForm from "./FeedbackForm";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function ReportDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const { user } = useAuth();
  const { report, isLoading, error, submitFeedback, isSubmittingFeedback, feedbackError } =
    useReportDetail(id);
  const [isExporting, setIsExporting] = useState(false);

  const currentUserId = user?.id ?? user?.userId;
  const isOwner =
    report?.reporterId != null && String(report.reporterId) === String(currentUserId);

  const reportPhotos = report?.images?.filter((img) => img.imageType === "REPORT_PHOTO") ?? [];
  const resolutionPhotos = report?.images?.filter((img) => img.imageType === "RESOLUTION_PHOTO") ?? [];

  async function handleExport() {
    setIsExporting(true);
    try {
      const { exportReportPdf } = await import("@/lib/reportPdf");
      await exportReportPdf(report, { steps: report.history });
    } catch {
      toast.error(t("Failed to export PDF"));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col">
      <div className="flex flex-col gap-5 px-5 pb-8 pt-4">
        {isLoading ? (
          <p className="py-6 text-sm text-muted-foreground">{t("Loading…")}</p>
        ) : error ? (
          <div className="flex flex-col items-start gap-2 py-6">
            <p className="text-sm text-destructive">{error}</p>
            <Link to="/report" className="text-sm font-semibold text-primary">
              {t("Back to your reports")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <h2 className="font-display text-lg font-bold text-foreground">
                  {report.title ?? t("Report detail")}
                </h2>
                <span className="text-[11px] text-muted-foreground">{report.reportCode}</span>
                {report.anonymous && (
                  <span className="text-[11px] text-muted-foreground">
                    {t("Shown as Anonymous on the public feed")}
                  </span>
                )}
              </div>
              <button
                type="button"
                aria-label={t("Export PDF")}
                disabled={isExporting}
                onClick={handleExport}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground disabled:opacity-50"
              >
                <Download className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <StatusBadge status={report.status} />
              {report.departmentName && (
                <span className="text-xs text-muted-foreground">{report.departmentName}</span>
              )}
            </div>

            {reportPhotos.length > 0 && (
              <div className="flex gap-2">
                {reportPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="h-[110px] w-[110px] shrink-0 overflow-hidden rounded-md bg-muted"
                  >
                    <img src={photo.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <p className="text-[13px] leading-[1.4] text-foreground">{report.description}</p>

            {report.status === "REJECTED" && report.rejectionReason && (
              <div className="rounded-lg bg-red-50 p-4 text-[13px] text-red-700">
                <span className="font-semibold">{t("Reason: ")}</span>
                {report.rejectionReason}
              </div>
            )}

            <StatusTimeline steps={report.history} />

            {resolutionPhotos.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <h2 className="font-display text-sm font-bold text-foreground">{t("Resolution photo")}</h2>
                <div className="flex gap-2">
                  {resolutionPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="h-[110px] w-[150px] shrink-0 overflow-hidden rounded-md bg-muted"
                    >
                      <img src={photo.imageUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {report.status === "RESOLVED" && isOwner && (
              <FeedbackForm
                feedback={report.feedback}
                onSubmit={submitFeedback}
                isSubmitting={isSubmittingFeedback}
                error={feedbackError}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
