import { api } from "@/services/apiClient";

/**
 * api-standards.md § Dashboard, Leaderboard and Notification Endpoints —
 * "GET /api/dashboard/admin". Response shape (see the documented example
 * body): `pendingAccountCount`, `pendingReportCount`, `totalCitizenCount`,
 * `totalReportCount`, `recentRegistrations` (PENDING citizens only, up to
 * 10), `reportsAwaitingApproval` (up to 10). The four stat cards in
 * AdminDashboardPage map straight onto the first four fields.
 *
 * Approve/reject for both "Recent registrations" and "Reports awaiting
 * approval" happen on their respective detail pages (admin-approvals /
 * report detail) instead of inline here.
 */
export const adminDashboardApi = {
  getSummary: () => api.get("/dashboard/admin").then((res) => res.data),
  getCategoryVolume: () => api.get("/dashboard/categories").then((res) => res.data),
};
