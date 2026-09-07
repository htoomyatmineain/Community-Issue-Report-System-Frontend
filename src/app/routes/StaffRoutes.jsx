import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import StaffLayout from "./StaffLayout";
import { ROLES } from "@/lib/rbac";
import { StaffDashboardPage } from "@/features/staff/staff-dashboard";
import { ConsoleReportsPage, ConsoleReportDetailPage } from "@/features/console-reports";
import { StaffSettingsPage } from "@/features/staff/staff-settings";
import { ConsoleNotificationsPage } from "@/features/console-notifications";

// Lazy — pulls in the Leaflet map-vendor chunk only when the console map is opened.
const ConsoleMapPage = lazy(() =>
  import("@/features/console-map").then((m) => ({ default: m.ConsoleMapPage }))
);
// Lazy — pulls in the recharts chart-vendor chunk only on the department analytics page.
const StaffDepartmentsPage = lazy(() =>
  import("@/features/staff/staff-departments").then((m) => ({ default: m.StaffDepartmentsPage }))
);

/** Routes under /staff — Government Staff role only. */
export default function StaffRoutes() {
  return (
    <Route path="/staff" element={<ProtectedRoute allow={[ROLES.STAFF]} />}>
      <Route element={<StaffLayout />}>
        <Route index element={<StaffDashboardPage />} />
        <Route path="reports" element={<ConsoleReportsPage />} />
        <Route path="reports/:id" element={<ConsoleReportDetailPage />} />
        <Route path="map" element={<ConsoleMapPage />} />
        <Route path="departments" element={<StaffDepartmentsPage />} />
        <Route path="settings" element={<StaffSettingsPage />} />
        <Route path="notifications" element={<ConsoleNotificationsPage />} />
      </Route>
    </Route>
  );
}
