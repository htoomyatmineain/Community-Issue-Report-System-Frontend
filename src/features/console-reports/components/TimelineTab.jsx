import StatusTimeline from "@/components/common/StatusTimeline";
import ReportPhoto from "@/components/common/ReportPhoto";
import { REPORT_STATUS } from "@/lib/constants";
import { useLanguage } from "@/app/providers/LanguageProvider";

/** First history row has oldStatus === null (database-schema.md: "nullable (null on creation)"). Exported for reuse by the PDF export. */
export function stepLabelKey({ oldStatus, newStatus }) {
  return oldStatus == null ? "Report submitted" : REPORT_STATUS[newStatus]?.label ?? newStatus;
}

/**
 * Console Report Detail's "Timeline" tab — the full status_history, remarks
 * included, plus the completion photo(s) once resolved. Admins don't get a
 * separate Resolution tab, so this is the only place they see that evidence.
 */
export default function TimelineTab({ history, report }) {
  const { t } = useLanguage();
  const resolutionPhotos = report?.images?.filter((img) => img.imageType === "RESOLUTION_PHOTO") ?? [];

  if (!history?.length) {
    return <p className="py-6 text-sm text-ink-muted">{t("No status changes yet.")}</p>;
  }

  const steps = history.map((h) => ({ labelKey: stepLabelKey(h), remarks: h.remarks, at: h.changedAt }));
  return (
    <div className="flex flex-col gap-6">
      <StatusTimeline steps={steps} />
      {resolutionPhotos.length > 0 && (
        <div className="border-t border-console-border pt-5">
          <h3 className="mb-2 text-sm font-semibold text-ink">{t("Completion photos")}</h3>
          <div className="flex flex-wrap gap-2">
            {resolutionPhotos.map((photo) => (
              <ReportPhoto key={photo.id} src={photo.imageUrl} alt={t("Completion photos")} className="h-32 w-32" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
