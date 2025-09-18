import axios from "axios";

// 🔗 Use .env variable (fallback to localhost for dev)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "➡️ API Request:",
    config.method?.toUpperCase(),
    config.baseURL + config.url,
    config.data || ""
  );

  return config;
});

// Log responses + handle errors
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.data);
    return response;
  },
  async (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data || error.message
    );

    // 🔄 Refresh token logic (only if you implement refresh endpoint on backend)
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: localStorage.getItem("refreshToken"),
        });
        const newToken = refreshRes.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
