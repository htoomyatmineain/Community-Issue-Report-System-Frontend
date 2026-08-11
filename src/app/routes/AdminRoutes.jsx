import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "@/lib/rbac";
import { AdminDashboardPage } from "@/features/admin/admin-dashboard";
import { AdminCitizensPage } from "@/features/admin/admin-citizens";
import { AdminStaffPage } from "@/features/admin/admin-staff";
import { AdminApprovalsPage } from "@/features/admin/admin-approvals";

/** Routes under /admin — Admin role only. */
export default function AdminRoutes() {
  return (
    <Route path="/admin" element={<ProtectedRoute allow={[ROLES.ADMIN]} />}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="citizens" element={<AdminCitizensPage />} />
      <Route path="staff" element={<AdminStaffPage />} />
      <Route path="approvals" element={<AdminApprovalsPage />} />
    </Route>
  );
}
