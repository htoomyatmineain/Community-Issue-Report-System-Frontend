import { api } from "@/services/apiClient";

/** api-standards.md § User Management Endpoints — staff account table + creation. */
export const adminStaffApi = {
  list: (params) => api.get("/users/staff", { params }),
  create: (payload) => api.post("/users/staff", payload),
  /** Staff creation requires a department, so the form needs the department list too. */
  listDepartments: () => api.get("/departments"),
};
