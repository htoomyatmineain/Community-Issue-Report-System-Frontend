import { api } from "@/services/apiClient";

/** api-standards.md § Report Endpoints — report approval queue. */
export const adminReportApprovalsApi = {
  listPending: () => api.get("/reports/pending").then((res) => res.data),
  approve: (id) => api.patch(`/reports/${id}/approve`).then((res) => res.data),
  reject: (id, rejectionReason) =>
    api.patch(`/reports/${id}/reject`, { rejectionReason }).then((res) => res.data),
};
