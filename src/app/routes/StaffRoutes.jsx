import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import StaffLayout from "./StaffLayout";
import { ROLES } from "@/lib/rbac";
import { StaffDashboardPage } from "@/features/staff/staff-dashboard";
import { StaffReportsPage } from "@/features/staff/staff-reports";
import { StaffMapPage } from "@/features/staff/staff-map";
import { StaffDepartmentsPage } from "@/features/staff/staff-departments";
import { StaffSettingsPage } from "@/features/staff/staff-settings";
import { StaffNotificationsPage } from "@/features/staff/staff-notifications";

/** Routes under /staff — Government Staff role only. */
export default function StaffRoutes() {
  return (
    <Route path="/staff" element={<ProtectedRoute allow={[ROLES.STAFF]} />}>
      <Route element={<StaffLayout />}>
        <Route index element={<StaffDashboardPage />} />
        <Route path="reports" element={<StaffReportsPage />} />
        <Route path="map" element={<StaffMapPage />} />
        <Route path="departments" element={<StaffDepartmentsPage />} />
        <Route path="settings" element={<StaffSettingsPage />} />
        <Route path="notifications" element={<StaffNotificationsPage />} />
      </Route>
    </Route>
  );
}
