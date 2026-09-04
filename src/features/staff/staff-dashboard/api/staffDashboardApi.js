import { api } from "@/services/apiClient";

/**
 * api-standards.md § Dashboard, Leaderboard and Notification Endpoints —
 * "GET /api/dashboard/staff | STAFF | Total / resolved / remaining / new
 * report counts, monthly series per department, 10 most recent reports."
 * No example body documented; assumed shape:
 * {
 *   totalReports, resolvedReports, remainingReports, newTodayReports,
 *   volumeByDepartment: [{ departmentName, reportCount }],
 *   recentReports: [ReportDTO, ...]
 * }
 * Scoped server-side to the caller's own department, same as every other
 * staff-facing report endpoint.
 */
export const staffDashboardApi = {
  getSummary: () => api.get("/dashboard/staff").then((res) => res.data),
};
