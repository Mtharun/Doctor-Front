import { apiRequest } from "./client.js";

export const AuthApi = {
  register: (payload) => apiRequest("/api/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => apiRequest("/api/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => apiRequest("/api/auth/me"),
  updateProfile: (payload) => apiRequest("/api/auth/me", { method: "PUT", body: payload }),
  changePassword: (payload) => apiRequest("/api/auth/me/password", { method: "PUT", body: payload }),
};
