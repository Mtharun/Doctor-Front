import { apiRequest } from "./client.js";

export const PatientsApi = {
  list: (search) => apiRequest(`/api/patients${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  get: (id) => apiRequest(`/api/patients/${id}`),
};
