import { api } from "@/services/apiClient";

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (payload) => api.post("/auth/signup", payload),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};
