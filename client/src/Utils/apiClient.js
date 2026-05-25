import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const isFileUpload = (config) => config?.data instanceof FormData;
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (isFileUpload(config)) {
      config.timeout = 5 * 60 * 1000;
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      const isUpload = isFileUpload(error.config);
      return Promise.reject(
        isUpload
          ? "Upload timed out — file may be too large or connection is slow. Try a smaller file."
          : "Request timed out. Please check your connection and try again."
      );
    }
    if (error.response) {
      const { status, data, headers } = error.response;
      const contentType = headers?.["content-type"] || "";
      if (contentType.includes("text/html")) {
        console.error("Server returned HTML — check VITE_API_BASE_URL or server status.");
        if (status === 404) return Promise.reject("API endpoint not found (404). Check your server routes.");
        if (status === 502 || status === 503) return Promise.reject("Server is unavailable. Please try again later.");
        return Promise.reject("Unexpected server error. Please try again.");
      }

      console.error("API Error:", data);
      if (status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject("Session expired. Please log in again.");
      }
      const message =
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
        `Request failed with status ${status}`;

      return Promise.reject(message);
    }
    console.error("Network Error:", error.message);
    return Promise.reject(
      error.message === "Network Error"
        ? "Cannot connect to server. Check your internet connection or server status."
        : error.message || "Network error"
    );
  }
);

export default axiosInstance;