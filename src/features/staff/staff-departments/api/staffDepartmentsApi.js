import { api } from "@/services/apiClient";

/**
 * api-standards.md § Dashboard, Leaderboard and Notification Endpoints —
 * "GET /api/dashboard/departments | ADMIN, STAFF | Workload and performance
 * per department (open count, resolved count, average resolution hours,
 * average rating)." No example body documented; assumed shape per
 * department: { departmentId, departmentName, openCount, inProgressCount,
 * resolvedCount, avgResolutionHours, avgRating, monthlyVolume: [{ month,
 * reportCount }] }. `inProgressCount` and `monthlyVolume` extend the
 * documented fields to satisfy ui-rules.md's "open / in progress / resolved
 * counts" cards and "bar chart of monthly volume" — revisit once the real
 * DTO ships.
 */
export const staffDepartmentsApi = {
  getDashboard: () => api.get("/dashboard/departments").then((res) => res.data),
};
