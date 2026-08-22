import { User, MapPin } from "lucide-react";
import ReportMap from "@/components/map/ReportMap";

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
export default function OverviewTab({ report }) {
  const photos = report.images?.filter((img) => img.imageType === "REPORT_PHOTO") ?? [];

  return (
    <div className="flex flex-col gap-6">
      {photos.length > 0 && (
        <div className="flex gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="h-32 w-32 shrink-0 overflow-hidden rounded-md bg-surface-muted">
              <img src={photo.imageUrl} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 className="mb-1.5 text-sm font-semibold text-ink">Description</h3>
        <p className="text-sm text-ink-muted">{report.description}</p>
      </div>

      {report.status === "REJECTED" && report.rejectionReason && (
        <div className="rounded-md bg-status-rejected-bg p-3 text-sm text-status-rejected">
          <span className="font-semibold">Rejection reason: </span>
          {report.rejectionReason}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 rounded-console border border-console-border p-4">
        <div>
          <span className="block text-xs text-ink-muted">Category</span>
          <span className="text-sm font-medium text-ink">{report.categoryName}</span>
        </div>
        <div>
          <span className="block text-xs text-ink-muted">Department</span>
          <span className="text-sm font-medium text-ink">{report.departmentName ?? "Not yet routed"}</span>
        </div>
        <div>
          <span className="block text-xs text-ink-muted">Assigned staff</span>
          <span className="text-sm font-medium text-ink">{report.assignedStaffName ?? "Unassigned"}</span>
        </div>
        <div>
          <span className="block text-xs text-ink-muted">Submitted</span>
          <span className="text-sm font-medium text-ink">{formatDateTime(report.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-console border border-console-border p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <User className="size-4 text-ink-muted" />
          Reporter
        </div>
        <span className="text-sm text-ink-muted">{report.reporterName ?? "—"}</span>

        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink">
          <MapPin className="size-4 text-ink-muted" />
          Location
        </div>
        <span className="text-sm text-ink-muted">
          {report.addressText ?? `${report.latitude?.toFixed(5)}, ${report.longitude?.toFixed(5)}`}
        </span>

        {report.latitude != null && report.longitude != null && (
          <ReportMap
            pins={[
              {
                id: report.id,
                latitude: report.latitude,
                longitude: report.longitude,
                categoryColor: report.categoryColor ?? "#475569",
              },
            ]}
            interactive={false}
            cluster={false}
            fitToPins={false}
            initialCenter={[report.latitude, report.longitude]}
            initialZoom={16}
            className="mt-2 h-40 rounded-md"
          />
        )}
      </div>
    </div>
  );
}
