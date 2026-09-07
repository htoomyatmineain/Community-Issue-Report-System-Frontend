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

  /**
   * api-standards.md § "Submit a report — duplicate check": POST /api/reports
   * runs a proximity duplicate check before persisting. Three response shapes:
   *   - 201 + ReportDTO                     → report created
   *   - 200 + ReportDTO (confirmDuplicateOfId set) → an existing report confirmed, none created
   *   - 200 + DuplicateCheckResultDTO       → possible duplicates found, nothing created yet;
   *                                           resubmit with confirmDuplicateOfId or forceCreate
   * Normalised here into `{ outcome, report?, possibleDuplicates? }` so the
   * caller never mistakes a duplicate prompt for a created report.
   */
  submitReport: ({
    categoryId,
    description,
    latitude,
    longitude,
    photos,
    confirmDuplicateOfId,
    forceCreate,
  }) => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            title: titleFromDescription(description),
            categoryId,
            description,
            latitude,
            longitude,
            ...(confirmDuplicateOfId != null ? { confirmDuplicateOfId } : {}),
            ...(forceCreate ? { forceCreate: true } : {}),
          }),
        ],
        { type: "application/json" }
      )
    );
    photos?.forEach((photo) => formData.append("images", photo));
    return api.post("/reports", formData).then((res) => {
      if (Array.isArray(res.data?.possibleDuplicates)) {
        return { outcome: "DUPLICATES_FOUND", possibleDuplicates: res.data.possibleDuplicates };
      }
      return { outcome: "CREATED", report: res.data };
    });
  },

  submitFeedback: (id, feedback) =>
    api.post("/feedback", { reportId: Number(id), ...feedback }).then((res) => res.data),
};
