import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import StaffLayout from "./StaffLayout";
import { ROLES } from "@/lib/rbac";
import { StaffDashboardPage } from "@/features/staff/staff-dashboard";
import { ConsoleReportsPage, ConsoleReportDetailPage } from "@/features/console-reports";
import { ConsoleMapPage } from "@/features/console-map";
import { StaffDepartmentsPage } from "@/features/staff/staff-departments";
import { StaffSettingsPage } from "@/features/staff/staff-settings";
import { ConsoleNotificationsPage } from "@/features/console-notifications";

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
