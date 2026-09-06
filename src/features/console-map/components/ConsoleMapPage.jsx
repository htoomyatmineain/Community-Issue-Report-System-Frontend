import { useAuth } from "@/app/providers/AuthProvider";
import { ROLES } from "@/lib/rbac";
import { REPORT_PRIORITY } from "@/lib/constants";
import ReportMap from "@/components/map/ReportMap";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useReportMap } from "@/features/report-map";
import PinDetailPanel from "./PinDetailPanel";
import { useLanguage } from "@/app/providers/LanguageProvider";

const STATUS_FILTERS = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING_APPROVAL", label: "Pending approval" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "REJECTED", label: "Rejected" },
];

/** Console full-screen map view (ui-rules.md "Full Map View") — shared by Admin and Staff. */
export default function ConsoleMapPage() {
  const { t } = useLanguage();
  const { role } = useAuth();
  const basePath = role === ROLES.ADMIN ? "/admin/reports" : "/staff/reports";

  const {
    pins,
    error,
    categories,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    priority,
    setPriority,
    setBounds,
    selectedPin,
    selectedPinId,
    selectPin,
  } = useReportMap();

  return (
    <div className="-m-8 flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-console-border bg-surface px-6 py-3">
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("Category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("All categories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("All priorities")}</SelectItem>
            {Object.keys(REPORT_PRIORITY).map((p) => (
              <SelectItem key={p} value={p}>
                {t(REPORT_PRIORITY[p].label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>

      <div className="relative flex-1">
        <ReportMap pins={pins} selectedPinId={selectedPinId} onPinClick={(pin) => selectPin(pin.id)} onBoundsChange={setBounds} className="h-full" />
        <PinDetailPanel pin={selectedPin} basePath={basePath} onClose={() => selectPin(null)} />
      </div>
    </div>
  );
}
