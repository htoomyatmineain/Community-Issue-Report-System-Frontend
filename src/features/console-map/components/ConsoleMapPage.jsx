import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLES } from "@/lib/rbac";
import { REPORT_PRIORITY } from "@/lib/constants";
import { categoryIcon } from "@/lib/categoryIcons";
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
  const [searchParams] = useSearchParams();

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
    selectedPin,
    selectedPinId,
    selectPin,
  } = useReportMap();

  // Deep link from a report detail's "View Full Map" — /admin|staff/map?focus=<reportId>.
  useEffect(() => {
    const focus = searchParams.get("focus");
    if (focus) selectPin(Number(focus));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden [&_.leaflet-top.leaflet-left]:!top-16">
      {/* Floating filters — no full row background, individual controls float over the map */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-wrap items-center gap-3 p-4 sm:p-5">
        <div className="pointer-events-auto flex flex-wrap items-center gap-3">
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-48 border-console-border bg-surface shadow-md hover:bg-surface-muted focus:ring-1 focus:ring-primary/40">
              <SelectValue placeholder={t("Category")} />
            </SelectTrigger>
            <SelectContent className="z-[1100]">
              <SelectItem value="ALL">{t("All categories")}</SelectItem>
              {categories.map((c) => {
                const CatIcon = categoryIcon(c);
                return (
                  <SelectItem key={c.id} value={String(c.id)}>
                    <span className="flex items-center gap-2">
                      <CatIcon className="size-4 shrink-0" style={{ color: c.colorHex ?? undefined }} />
                      {c.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44 border-console-border bg-surface shadow-md hover:bg-surface-muted focus:ring-1 focus:ring-primary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[1100]">
              {STATUS_FILTERS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-40 border-console-border bg-surface shadow-md hover:bg-surface-muted focus:ring-1 focus:ring-primary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[1100]">
              <SelectItem value="ALL">{t("All priorities")}</SelectItem>
              {Object.keys(REPORT_PRIORITY).map((p) => (
                <SelectItem key={p} value={p}>
                  {t(REPORT_PRIORITY[p].label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <span className="pointer-events-auto rounded-md border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive">
            {error}
          </span>
        )}
      </div>

      <ReportMap pins={pins} selectedPinId={selectedPinId} onPinClick={(pin) => selectPin(pin.id)} className="h-full" />
      <PinDetailPanel pin={selectedPin} basePath={basePath} onClose={() => selectPin(null)} />
    </div>
  );
}
