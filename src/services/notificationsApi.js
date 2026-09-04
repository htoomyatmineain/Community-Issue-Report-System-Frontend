import { api } from "@/services/apiClient";

/**
 * api-standards.md § Dashboard, Leaderboard and Notification Endpoints.
 * Every endpoint here scopes to the caller's own notifications regardless of
 * role — shared by the citizen, staff, and admin notification pages/bells.
 */
export const notificationsApi = {
  list: () => api.get("/notifications").then((res) => res.data),
  unreadCount: () => api.get("/notifications/unread-count").then((res) => res.data.count),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};
