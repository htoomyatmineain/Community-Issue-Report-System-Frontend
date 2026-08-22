import { api } from "@/services/apiClient";

/**
 * Shared across all three roles — api-standards.md's citizen-visibility rule
 * ("Citizens only see reports with status other than PENDING_APPROVAL and
 * REJECTED") is enforced server-side, so there's no client-side role branching
 * in the request itself.
 */
export const reportMapApi = {
  getPins: (params) => api.get("/reports/map", { params }).then((res) => res.data),
  listCategories: () => api.get("/categories").then((res) => res.data.filter((c) => c.active)),
};
