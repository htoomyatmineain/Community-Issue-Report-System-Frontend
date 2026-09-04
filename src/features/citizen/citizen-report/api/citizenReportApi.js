import { api } from "@/services/apiClient";
import { REPORT_STATUS } from "@/lib/constants";

/** First history row has oldStatus === null (database-schema.md: "nullable (null on creation)"). */
function historyStepLabelKey({ oldStatus, newStatus }) {
  return oldStatus == null ? "Report submitted" : REPORT_STATUS[newStatus]?.label ?? newStatus;
}

// ui-rules.md's report form deliberately has no separate "title" field — just
// Category + one "What's wrong?" description box — but reports.title is
// NOT NULL (database-schema.md) and CreateReportDTO requires it (@NotBlank,
// max 150 chars). Derive one from the description instead of adding a field
// the design doesn't call for.
const TITLE_MAX_LENGTH = 80;

function titleFromDescription(description) {
  if (description.length <= TITLE_MAX_LENGTH) return description;
  const truncated = description.slice(0, TITLE_MAX_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated}…`;
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
    return {
      ...report,
      history: history.map((h) => ({ labelKey: historyStepLabelKey(h), remarks: h.remarks, at: h.changedAt })),
    };
  },

  submitReport: ({ categoryId, description, latitude, longitude, photos }) => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob(
        [JSON.stringify({ title: titleFromDescription(description), categoryId, description, latitude, longitude })],
        { type: "application/json" }
      )
    );
    photos?.forEach((photo) => formData.append("images", photo));
    return api.post("/reports", formData).then((res) => res.data);
  },

  submitFeedback: (id, feedback) =>
    api.post("/feedback", { reportId: Number(id), ...feedback }).then((res) => res.data),
};
