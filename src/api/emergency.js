import { apiRequest } from "./client.js";

export const EmergencyApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return apiRequest(`/api/emergency${qs ? `?${qs}` : ""}`);
  },
  create: (formData) => apiRequest("/api/emergency", { method: "POST", body: formData }),
  updateStatus: (id, status) => apiRequest(`/api/emergency/${id}/status`, { method: "PUT", body: { status } }),
};
