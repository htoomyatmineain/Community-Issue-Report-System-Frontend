import { api } from "@/services/apiClient";

/** api-standards.md § Dashboard, Leaderboard and Notification Endpoints. */
export const staffNotificationsApi = {
  list: () => api.get("/notifications").then((res) => res.data),
  unreadCount: () => api.get("/notifications/unread-count").then((res) => res.data.count),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};
