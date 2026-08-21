import { api } from "@/services/apiClient";

/**
 * Shared between the Admin and Staff console shells — ui-rules.md specs one
 * Reports list + detail page for both roles ("Reports | /console/reports |
 * Admin, Staff"); staff are scoped to their own department server-side
 * (api-standards.md), so no client-side role branching is needed here.
 */
export const consoleReportsApi = {
  list: (params) => api.get("/reports", { params }).then((res) => res.data),
  getById: (id) => api.get(`/reports/${id}`).then((res) => res.data),
  getHistory: (id) => api.get(`/reports/${id}/history`).then((res) => res.data),
  getComments: (id) => api.get(`/reports/${id}/comments`).then((res) => res.data),
  addComment: (id, payload) => api.post(`/reports/${id}/comments`, payload).then((res) => res.data),
  changeStatus: (id, payload) => api.patch(`/reports/${id}/status`, payload).then((res) => res.data),
  setPriority: (id, priority) =>
    api.patch(`/reports/${id}/priority`, { priority }).then((res) => res.data),
  assign: (id, payload) => api.patch(`/reports/${id}/assign`, payload).then((res) => res.data),
  uploadResolutionPhotos: (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return api.post(`/reports/${id}/images`, formData).then((res) => res.data);
  },
  listDepartments: () => api.get("/departments").then((res) => res.data),
  listCategories: () => api.get("/categories").then((res) => res.data),
  listStaff: () => api.get("/users/staff").then((res) => res.data),
};
