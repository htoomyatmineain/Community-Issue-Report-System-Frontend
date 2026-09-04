import { api } from "@/services/apiClient";

/**
 * api-standards.md § Dashboard, Leaderboard and Notification Endpoints —
 * "GET /api/dashboard/admin | ADMIN | Pending account count, pending report
 * count, 10 latest registrations, latest reports awaiting approval." No
 * example body is documented; assumed shape adds `totalCitizenCount` /
 * `totalReportCount` (ui-rules.md's admin dashboard names 4 stat cards —
 * Pending accounts, Pending reports, Total citizens, Total reports — the
 * last two aren't in the endpoint's terse description). Revisit once the
 * real DTO ships.
 *
 * Approve/reject reuse the same endpoints as admin-approvals /
 * admin-report-approvals (api-standards.md § User Management / Report
 * Endpoints) — duplicated here rather than imported cross-feature, per
 * CLAUDE.md's "avoid cross-feature imports" convention.
 */
export const adminDashboardApi = {
  getSummary: () => api.get("/dashboard/admin").then((res) => res.data),
  getCategoryVolume: () => api.get("/dashboard/categories").then((res) => res.data),
  approveAccount: (id) => api.patch(`/users/${id}/approve`),
  rejectAccount: (id, reason) => api.patch(`/users/${id}/reject`, { reason }),
  approveReport: (id) => api.patch(`/reports/${id}/approve`),
  rejectReport: (id, rejectionReason) => api.patch(`/reports/${id}/reject`, { rejectionReason }),
};
