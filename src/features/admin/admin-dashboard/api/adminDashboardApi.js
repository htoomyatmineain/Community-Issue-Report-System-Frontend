import { api } from "@/services/apiClient";

/**
 * api-standards.md § Dashboard, Leaderboard and Notification Endpoints —
 * "GET /api/dashboard/admin". Response shape (see the documented example
 * body): `pendingAccountCount`, `pendingReportCount`, `totalCitizenCount`,
 * `totalReportCount`, `recentRegistrations` (PENDING citizens only, up to
 * 10), `reportsAwaitingApproval` (up to 10). The four stat cards in
 * AdminDashboardPage map straight onto the first four fields.
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
