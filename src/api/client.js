// Small fetch() wrapper shared by every api/*.js file. Centralizing this
// means only one place knows the backend's base URL, how to attach the
// JWT, and how to turn a failed response into a JS Error with a useful
// message the UI can show the user.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

export class ApiRequestError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// method: GET/POST/PUT/DELETE. body: plain object (sent as JSON) or a
// FormData instance (for file uploads - skips the JSON content-type so
// the browser can set its own multipart boundary).
export async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  const isFormData = body instanceof FormData;

  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiRequestError(
      "Could not reach the server. Check your connection and try again.",
      0
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // No JSON body (e.g. a 204, or the server is down) - fall through.
  }

  if (!response.ok) {
    const message = data?.message || "Something went wrong. Please try again.";
    throw new ApiRequestError(message, response.status, data?.details);
  }

  return data;
}

// Exposed so pages can build absolute URLs to uploaded files (reports,
// emergency images) which the backend serves from /uploads/*.
export { BASE_URL };
