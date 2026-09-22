import { apiRequest } from "./client.js";

export const AppointmentsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return apiRequest(`/api/appointments${qs ? `?${qs}` : ""}`);
  },
  get: (id) => apiRequest(`/api/appointments/${id}`),
  create: (payload) => apiRequest("/api/appointments", { method: "POST", body: payload }),
  updateStatus: (id, status) => apiRequest(`/api/appointments/${id}/status`, { method: "PUT", body: { status } }),
  reschedule: (id, payload) => apiRequest(`/api/appointments/${id}/reschedule`, { method: "PUT", body: payload }),
  stats: () => apiRequest("/api/appointments/stats"),
};
