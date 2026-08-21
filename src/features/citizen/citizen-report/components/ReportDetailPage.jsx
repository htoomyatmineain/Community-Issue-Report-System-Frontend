import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "@/components/common/StatusBadge";
import { useReportDetail } from "../hooks/useReportDetail";
import StatusTimeline from "./StatusTimeline";
import FeedbackForm from "./FeedbackForm";

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { report, isLoading, error, submitFeedback, isSubmittingFeedback, feedbackError } =
    useReportDetail(id);

  const reportPhotos = report?.images?.filter((img) => img.imageType === "REPORT_PHOTO") ?? [];
  const resolutionPhotos = report?.images?.filter((img) => img.imageType === "RESOLUTION_PHOTO") ?? [];

  return (
    <div className="flex w-full max-w-md flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display text-base font-bold text-foreground">
            {report?.title ?? "Report detail"}
          </h1>
          {report && <span className="text-[11px] text-muted-foreground">{report.reportCode}</span>}
        </div>
      </header>

      <div className="flex flex-col gap-5 px-5 pb-8 pt-2">
        {isLoading ? (
          <p className="py-6 text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <div className="flex flex-col items-start gap-2 py-6">
            <p className="text-sm text-destructive">{error}</p>
            <Link to="/report" className="text-sm font-semibold text-primary">
              Back to your reports
            </Link>
          </div>
        ) : (
          <>
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
                <span className="font-semibold">Reason: </span>
                {report.rejectionReason}
              </div>
            )}

            <StatusTimeline steps={report.history} />

            {resolutionPhotos.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <h2 className="font-display text-sm font-bold text-foreground">Resolution photo</h2>
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

            {report.status === "RESOLVED" && (
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
