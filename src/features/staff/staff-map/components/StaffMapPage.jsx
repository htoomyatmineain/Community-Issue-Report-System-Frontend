import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useDepartmentName } from "@/hooks/useDepartmentName";
import { useLanguage } from "@/app/providers/LanguageProvider";
import ReportMap from "@/components/map/ReportMap";
import { useStaffDashboard } from "@/features/staff/staff-dashboard";
import { useReportMap } from "@/features/report-map";
import StaffCommandHeader from "@/features/staff/staff-dashboard/components/StaffCommandHeader";
import StaffReportInspector from "@/features/staff/staff-dashboard/components/StaffReportInspector";
import StaffTriageDrawer from "@/features/staff/staff-dashboard/components/StaffTriageDrawer";
import { evaluateStaffReportSla } from "@/features/staff/staff-dashboard/lib/staffAnalytics";

/**
 * Dedicated Interactive GIS Command Map View for Department Staff (/staff/map).
 * Combines an unobstructed full-bleed GIS map canvas with a streamlined top command HUD,
 * direct navigation to the main Staff Dashboard, priority-grouped dispatch queue,
 * and click-to-fly pin inspector.
 */
export default function StaffMapPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const departmentName = useDepartmentName(user?.departmentId);

  // 1. Data Hooks
  const { summary, reports, analytics, isLoading, error, refetch } = useStaffDashboard();
  const { pins: allPins } = useReportMap();

  // 2. Interactive GIS State
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const [fitSignal, setFitSignal] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Merge full reports with map coordinates and SLA evaluations
  const unifiedReports = useMemo(() => {
    const pinCoordMap = new Map();
    allPins.forEach((p) => {
      if (p.id) pinCoordMap.set(p.id, { lat: p.latitude, lng: p.longitude, color: p.categoryColor, icon: p.categoryIcon });
    });

    const reportDict = new Map();

    reports.forEach((r) => {
      const coords = pinCoordMap.get(r.id);
      reportDict.set(r.id, {
        ...r,
        latitude: r.latitude ?? coords?.lat ?? 16.8409,
        longitude: r.longitude ?? coords?.lng ?? 96.1735,
        categoryColor: r.categoryColor ?? coords?.color,
        categoryIcon: r.categoryIcon ?? coords?.icon,
        sla: evaluateStaffReportSla(r),
      });
    });

    if (Array.isArray(summary?.recentReports)) {
      summary.recentReports.forEach((r) => {
        if (!reportDict.has(r.id)) {
          const coords = pinCoordMap.get(r.id);
          reportDict.set(r.id, {
            ...r,
            latitude: r.latitude ?? coords?.lat ?? 16.8409,
            longitude: r.longitude ?? coords?.lng ?? 96.1735,
            categoryColor: r.categoryColor ?? coords?.color,
            categoryIcon: r.categoryIcon ?? coords?.icon,
            sla: evaluateStaffReportSla(r),
          });
        }
      });
    }

    allPins.forEach((p) => {
      if (!reportDict.has(p.id)) {
        reportDict.set(p.id, {
          id: p.id,
          reportCode: p.reportCode,
          title: p.title || p.reportCode,
          status: p.status,
          priority: p.priority,
          latitude: p.latitude,
          longitude: p.longitude,
          categoryId: p.categoryId,
          categoryName: p.categoryName,
          categoryColor: p.categoryColor,
          categoryIcon: p.categoryIcon,
          createdAt: p.createdAt,
          sla: evaluateStaffReportSla(p),
        });
      }
    });

    return Array.from(reportDict.values());
  }, [reports, summary, allPins]);

  // Pins for the Leaflet Map
  const mapPins = useMemo(() => {
    return unifiedReports
      .filter((r) => r.latitude != null && r.longitude != null)
      .map((r) => ({
        id: r.id,
        latitude: Number(r.latitude),
        longitude: Number(r.longitude),
        reportCode: r.reportCode,
        categoryName: r.categoryName,
        categoryColor: r.categoryColor,
        categoryIcon: r.categoryIcon,
        status: r.status,
        priority: r.priority,
      }));
  }, [unifiedReports]);

  // Total counts for header badges
  const filterCounts = useMemo(() => {
    let urgent = 0;
    let inProgress = 0;
    let assigned = 0;

    unifiedReports.forEach((r) => {
      if (
        r.priority === "URGENT" ||
        r.priority === "HIGH" ||
        r.sla?.status === "BREACHED" ||
        r.sla?.status === "AT_RISK"
      ) {
        urgent++;
      }
      if (r.status === "IN_PROGRESS") inProgress++;
      if (r.status === "ASSIGNED" || r.status === "PENDING_APPROVAL") assigned++;
    });

    return {
      all: unifiedReports.length,
      urgent,
      inProgress,
      assigned,
    };
  }, [unifiedReports]);

  const handleSelectReport = useCallback((report) => {
    setSelectedReport(report);
    setSelectedPinId(report.id);
  }, []);

  const handlePinClick = useCallback((pin) => {
    const found = unifiedReports.find((r) => r.id === pin.id);
    setSelectedReport(found || pin);
    setSelectedPinId(pin.id);
  }, [unifiedReports]);

  const handleCloseInspector = useCallback(() => {
    setSelectedReport(null);
    setSelectedPinId(null);
  }, []);

  const handleFitZone = useCallback(() => {
    setFitSignal((s) => s + 1);
  }, []);

  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetch]);

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-surface-muted select-none">
      {/* 1. Full-Bleed Interactive GIS Map Canvas (Unobstructed) */}
      <div className="absolute inset-0 z-0 [&_.leaflet-top.leaflet-left]:!top-24 [&_.leaflet-top.leaflet-right]:!top-20">
        <ReportMap
          pins={mapPins}
          selectedPinId={selectedPinId}
          onPinClick={handlePinClick}
          cluster
          interactive
          fitToPins
          fitSignal={fitSignal}
          switcherClassName="top-24 right-4"
        />
      </div>

      {/* 2. Floating Streamlined Command Header HUD */}
      <StaffCommandHeader
        departmentName={departmentName}
        analytics={analytics}
        filterCounts={filterCounts}
        isQueueOpen={isQueueOpen}
        onToggleQueue={() => setIsQueueOpen(!isQueueOpen)}
        onFitMap={handleFitZone}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 3. Floating Selected Report Inspector Pop-Up Card (Top-Left) */}
      {selectedReport && (
        <StaffReportInspector
          report={selectedReport}
          onClose={handleCloseInspector}
          onCenterOnMap={() => setSelectedPinId(selectedReport.id)}
        />
      )}

      {/* 4. Priority-Ranked Triage & Dispatch Queue Drawer (Right-Dock) */}
      <StaffTriageDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        reports={unifiedReports}
        selectedReportId={selectedPinId}
        onSelectReport={handleSelectReport}
      />

      {/* Error Toast (if any) */}
      {error && (
        <div className="pointer-events-auto absolute bottom-4 right-4 z-[900] max-w-sm rounded-xl border border-destructive/40 bg-surface p-3 text-xs text-destructive shadow-xl">
          {error}
        </div>
      )}
    </div>
  );
}
