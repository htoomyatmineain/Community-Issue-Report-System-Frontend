import { api } from "@/services/apiClient";
import { REPORT_STATUS } from "@/lib/constants";

/** First history row has oldStatus === null (database-schema.md: "nullable (null on creation)"). */
function historyStepLabel({ oldStatus, newStatus, remarks }) {
  const label = oldStatus == null ? "Report submitted" : REPORT_STATUS[newStatus]?.label ?? newStatus;
  return remarks ? `${label} — ${remarks}` : label;
}

/** api-standards.md § Report Endpoints, § Departments & Categories Endpoints, § Dashboard/Leaderboard/Notification Endpoints (Feedback). */
export const citizenReportApi = {
  listCategories: () => api.get("/categories").then((res) => res.data.filter((c) => c.active)),

  getMyReports: () => api.get("/reports/my").then((res) => res.data),

  getReportById: async (id) => {
    const [{ data: report }, { data: history }] = await Promise.all([
      api.get(`/reports/${id}`),
      api.get(`/reports/${id}/history`),
    ]);
    return { ...report, history: history.map((h) => ({ label: historyStepLabel(h), at: h.changedAt })) };
  },

  submitReport: ({ categoryId, description, latitude, longitude, photos }) => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify({ categoryId, description, latitude, longitude })], {
        type: "application/json",
      })
    );
    photos?.forEach((photo) => formData.append("images", photo));
    return api.post("/reports", formData).then((res) => res.data);
  },

  submitFeedback: (id, feedback) =>
    api.post("/feedback", { reportId: Number(id), ...feedback }).then((res) => res.data),
};
