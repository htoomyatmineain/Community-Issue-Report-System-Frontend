import { api } from "@/services/apiClient";
import {
  getMockReportById,
  getMockReportList,
  submitMockFeedback,
  submitMockReport,
} from "./citizenReport.mock";

// TODO: none of these backend endpoints exist yet (see api-standards.md §
// Report Endpoints): POST /api/reports (multipart), GET /api/reports/my,
// GET /api/reports/{id}, GET /api/reports/{id}/history, POST /api/feedback.
// Once they ship, flip this flag and delete citizenReport.mock.js.
const USE_MOCK_DATA = true;

/** API calls for the citizen-report feature. */
export const citizenReportApi = {
  getMyReports: () =>
    USE_MOCK_DATA ? getMockReportList() : api.get("/reports/my").then((res) => res.data),

  getReportById: (id) =>
    USE_MOCK_DATA ? getMockReportById(id) : api.get(`/reports/${id}`).then((res) => res.data),

  submitReport: (payload) => {
    if (USE_MOCK_DATA) return submitMockReport(payload);

    const formData = new FormData();
    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            categoryId: payload.category,
            description: payload.description,
            latitude: payload.latitude,
            longitude: payload.longitude,
          }),
        ],
        { type: "application/json" }
      )
    );
    payload.photos?.forEach((photo) => formData.append("images", photo));
    return api.post("/reports", formData).then((res) => res.data);
  },

  submitFeedback: (id, feedback) =>
    USE_MOCK_DATA
      ? submitMockFeedback(id, feedback)
      : api.post("/feedback", { reportId: id, ...feedback }).then((res) => res.data),
};
