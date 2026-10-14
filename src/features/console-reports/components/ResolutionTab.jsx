import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/common/EmptyState";
import ReportPhoto from "@/components/common/ReportPhoto";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Console Report Detail's "Resolution" tab — completion photo evidence and
 * the citizen's feedback once given. Display-only: the completion photo is
 * already collected by StatusChangeDialog when moving a report to Resolved,
 * so this tab doesn't need its own separate upload control.
 */
export default function ResolutionTab({ report }) {
  const { t } = useLanguage();
  const resolutionPhotos = report.images?.filter((img) => img.imageType === "RESOLUTION_PHOTO") ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">{t("Completion photos")}</h3>
        {resolutionPhotos.length === 0 ? (
          <EmptyState
            title="No completion photos yet"
            description="A completion photo is attached when this report moves to Resolved."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {resolutionPhotos.map((photo) => (
              <ReportPhoto
                key={photo.id}
                src={photo.imageUrl}
                alt={t("Completion photos")}
                className="h-32 w-32"
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">{t("Citizen feedback")}</h3>
        {report.feedback ? (
          <div className="rounded-xl border border-console-border/70 p-4 bg-surface-muted/20">
            <div className="mb-1.5 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "size-4",
                    n <= report.feedback.rating ? "fill-amber-500 text-amber-500" : "text-console-border"
                  )}
                />
              ))}
            </div>
            {report.feedback.comment && <p className="text-sm text-ink-muted">{report.feedback.comment}</p>}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">{t("No feedback from the citizen yet.")}</p>
        )}
      </div>
    </div>
  );
}
