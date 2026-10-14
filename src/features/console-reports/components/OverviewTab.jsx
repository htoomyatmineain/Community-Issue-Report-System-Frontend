import { User, MapPin, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import ReportMap from "@/components/map/ReportMap";
import ReportPhoto from "@/components/common/ReportPhoto";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

/** Photos, description, reporter and location — the console Report Detail's "Overview" tab. */
export default function OverviewTab({ report, mapHref }) {
  const { t } = useLanguage();
  const photos = report.images?.filter((img) => img.imageType === "REPORT_PHOTO") ?? [];

  return (
    <div className="flex flex-col gap-6">
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((photo) => (
            <ReportPhoto
              key={photo.id}
              src={photo.imageUrl}
              alt={t("Report photo")}
              className="h-32 w-32"
            />
          ))}
        </div>
      )}

      <div>
        <h3 className="mb-1.5 text-sm font-semibold text-ink">{t("Description")}</h3>
        <p className="text-sm text-ink-muted">{report.description}</p>
      </div>

      {report.status === "REJECTED" && report.rejectionReason && (
        <div className="rounded-md bg-status-rejected-bg p-3 text-sm text-status-rejected">
          <span className="font-semibold">{t("Rejection reason: ")}</span>
          {report.rejectionReason}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-console-border/70 bg-surface-muted/30 p-4">
        <div>
          <span className="block text-xs text-ink-muted">{t("Category")}</span>
          <span className="text-sm font-medium text-ink">{report.categoryName}</span>
        </div>
        <div>
          <span className="block text-xs text-ink-muted">
            {report.departmentName ? t("Department") : t("Planned department")}
          </span>
          <span className="text-sm font-medium text-ink">
            {report.departmentName
              ? t(report.departmentName)
              : report.plannedDepartmentName
                ? t(report.plannedDepartmentName)
                : t("Not yet routed")}
          </span>
        </div>
        <div>
          <span className="block text-xs text-ink-muted">{t("Assigned staff")}</span>
          <span className="text-sm font-medium text-ink">{report.assignedStaffName ?? t("Unassigned")}</span>
        </div>
        <div>
          <span className="block text-xs text-ink-muted">{t("Submitted")}</span>
          <span className="text-sm font-medium text-ink tabular-nums">{formatDateTime(report.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-console-border/70 bg-surface-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <User className="size-4 text-ink-muted" />
          {t("Reporter")}
          {report.anonymous && (
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {t("Anonymous")}
            </span>
          )}
        </div>
        <span className="text-sm text-ink-muted">
          {report.reporterName ?? "—"}
          {report.anonymous && (
            <span className="ml-1 text-xs">· {t("hidden on the public feed")}</span>
          )}
        </span>

        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink">
          <MapPin className="size-4 text-ink-muted" />
          {t("Location")}
        </div>
        <span className="text-sm text-ink-muted">
          {report.addressText ?? `${report.latitude?.toFixed(5)}, ${report.longitude?.toFixed(5)}`}
        </span>

        {report.latitude != null && report.longitude != null && (
          <div className="relative mt-2">
            <ReportMap
              pins={[
                {
                  id: report.id,
                  latitude: report.latitude,
                  longitude: report.longitude,
                  categoryColor: report.categoryColor ?? "#475569",
                  categoryIcon: report.categoryIcon,
                  categoryName: report.categoryName,
                },
              ]}
              interactive={false}
              cluster={false}
              fitToPins={false}
              initialCenter={[report.latitude, report.longitude]}
              initialZoom={16}
              className="h-40 rounded-md"
            />
            {mapHref && (
              <Link
                to={`${mapHref}?focus=${report.id}`}
                className="absolute bottom-2 right-2 z-[500] flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink shadow-md hover:bg-surface-muted"
              >
                <Maximize2 className="size-3.5" />
                {t("View Full Map")}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
