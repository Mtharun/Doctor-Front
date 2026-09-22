import { apiRequest } from "./client.js";

export const ServicesApi = {
  list: () => apiRequest("/api/services"),
  create: (payload) => apiRequest("/api/services", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/api/services/${id}`, { method: "PUT", body: payload }),
  remove: (id) => apiRequest(`/api/services/${id}`, { method: "DELETE" }),
};
