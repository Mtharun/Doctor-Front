import { apiRequest } from "./client.js";

export const NotificationsApi = {
  list: () => apiRequest("/api/notifications"),
  markRead: (id) => apiRequest(`/api/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () => apiRequest("/api/notifications/read-all", { method: "PUT" }),
};
