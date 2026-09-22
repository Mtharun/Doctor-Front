import { apiRequest } from "./client.js";

export const DentistsApi = {
  list: () => apiRequest("/api/dentists"),
  create: (payload) => apiRequest("/api/dentists", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/api/dentists/${id}`, { method: "PUT", body: payload }),
  remove: (id) => apiRequest(`/api/dentists/${id}`, { method: "DELETE" }),
  availability: (id, date) => apiRequest(`/api/dentists/${id}/availability?date=${date}`),
};
