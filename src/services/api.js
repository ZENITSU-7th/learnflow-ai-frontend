const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://learnflowai-backend-5yxg.onrender.com/api";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("learnflow_token");
  const headers = {
    ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem("learnflow_token");
    localStorage.removeItem("learnflow_user");
    window.dispatchEvent(new Event("learnflow:logout"));
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || "API request failed.");
  }

  return data;
};

export const api = {
  get: (path) => request(path),
  post: (path, body = {}) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body = {}) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
  register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getMe: () => request("/auth/me"),
};

export default api;
