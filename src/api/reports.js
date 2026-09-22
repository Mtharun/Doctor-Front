import { apiRequest } from "./client.js";

export const ReportsApi = {
  list: (patientId) => apiRequest(`/api/reports${patientId ? `?patientId=${patientId}` : ""}`),
  upload: (formData) => apiRequest("/api/reports", { method: "POST", body: formData }),
  remove: (id) => apiRequest(`/api/reports/${id}`, { method: "DELETE" }),
};
