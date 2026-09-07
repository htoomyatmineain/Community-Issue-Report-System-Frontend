import { api } from "@/services/apiClient";

/**
 * Shared across all three roles — api-standards.md's citizen-visibility rule
 * ("Citizens only see reports with status other than PENDING_APPROVAL and
 * REJECTED") is enforced server-side, so there's no client-side role branching
 * in the request itself.
 */
export const reportMapApi = {
  // Unfiltered, citizen-visible pins. Server-side cached (CacheConfig.PUBLIC_MAP,
  // 60s TTL, evicted on any report workflow change) and role-agnostic, so this
  // is the endpoint the citizen map uses — one request per session, filtering
  // happens client-side against the returned pins.
  getPublicPins: () => api.get("/reports/map/public").then((res) => res.data),
  // Role-scoped pins (staff/admin also see PENDING_APPROVAL and REJECTED).
  // Not cached; the console fetches it once and filters client-side.
  getPins: (params) => api.get("/reports/map", { params }).then((res) => res.data),
  listCategories: () => api.get("/categories").then((res) => res.data.filter((c) => c.active)),
};
