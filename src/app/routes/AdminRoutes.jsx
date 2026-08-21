import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "./AdminLayout";
import { ROLES } from "@/lib/rbac";
import { AdminDashboardPage } from "@/features/admin/admin-dashboard";
import { AdminCitizensPage } from "@/features/admin/admin-citizens";
import { AdminStaffPage } from "@/features/admin/admin-staff";
import { AdminApprovalsPage } from "@/features/admin/admin-approvals";
import { AdminDepartmentsPage } from "@/features/admin/admin-departments";
import { AdminCategoriesPage } from "@/features/admin/admin-categories";

/** Routes under /admin — Admin role only. */
export default function AdminRoutes() {
  return (
    <Route path="/admin" element={<ProtectedRoute allow={[ROLES.ADMIN]} />}>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="citizens" element={<AdminCitizensPage />} />
        <Route path="staff" element={<AdminStaffPage />} />
        <Route path="approvals" element={<AdminApprovalsPage />} />
        <Route path="departments" element={<AdminDepartmentsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>
    </Route>
  );
}
