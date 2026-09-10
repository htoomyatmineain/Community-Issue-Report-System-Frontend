import { api } from "@/services/apiClient";

/**
 * api-standards.md § Audit Endpoints — GET /api/audit-logs (admin-only,
 * read-only). Rows are written server-side by the services that mutate state
 * (account reviews, department/category changes, report transitions); there
 * is no write endpoint.
 */
export const auditLogsApi = {
  /** Paged envelope: { content, page, size, totalElements, totalPages }. */
  list: (params) => api.get("/audit-logs", { params }).then((res) => res.data),
  /** Distinct actors for the filter dropdown: [{ id, name }]. */
  listActors: () => api.get("/audit-logs/actors").then((res) => res.data),
};

/** Action values the backend emits (com.uit.scirs.audit.entity.AuditAction). */
export const AUDIT_ACTIONS = [
  "USER_APPROVED",
  "USER_REJECTED",
  "USER_SUSPENDED",
  "STAFF_CREATED",
  "DEPARTMENT_CREATED",
  "DEPARTMENT_UPDATED",
  "DEPARTMENT_DEACTIVATED",
  "CATEGORY_CREATED",
  "CATEGORY_UPDATED",
  "CATEGORY_DEACTIVATED",
  "REPORT_APPROVED",
  "REPORT_REJECTED",
  "REPORT_STATUS_CHANGED",
  "REPORT_ASSIGNED",
  "REPORT_PRIORITY_CHANGED",
];
