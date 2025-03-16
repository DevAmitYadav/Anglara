// api.js

import axios from "axios";
import API_ENDPOINTS from "./endpoints"; // Make sure you have this file with your endpoint definitions

// ─── Create Axios Instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  // Optionally, add a timeout or other axios config options here
});

// ─── Error Message Extractor ───────────────────────────────────────
const extractErrorMessage = (error) => {
  return (
    error?.response?.data?.errors?.[0]?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "An unknown error occurred"
  );
};

// ─── Get Authorization Headers ─────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Refresh Token Function ──────────────────────────────────────────
const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    if (!refreshTokenValue) {
      throw new Error("No refresh token found");
    }

    // Call the refresh token endpoint
    const { data } = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      token: refreshTokenValue,
    });

    // Get the new token (adjust the property name if necessary)
    const newToken = data.newToken || data.token;
    if (!newToken) {
      throw new Error("New token not provided");
    }

    // Store new token and update default headers
    localStorage.setItem("token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    return newToken;
  } catch (error) {
    console.error("❌ Token refresh failed:", extractErrorMessage(error));
    logoutUser();
    return null;
  }
};

// ─── Logout Function ──────────────────────────────────────────────────
const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// ─── Request Interceptor ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Always attach the latest token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor for Token Refresh ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If a 401 error occurs and this request wasn't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// ─── FormData Builder Helper ─────────────────────────────────────────
const buildFormData = (data, formData = new FormData(), parentKey = "") => {
  if (data && typeof data === "object" && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      // Example: remap "image" field to "profilePic" if needed
      const mappedKey = key === "image" ? "profilePic" : key;
      const fieldKey = parentKey ? `${parentKey}[${mappedKey}]` : mappedKey;

      if (value instanceof File) {
        formData.append(fieldKey, value, value.name);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) =>
          buildFormData(item, formData, `${fieldKey}[${index}]`)
        );
      } else if (typeof value === "object" && value !== null) {
        buildFormData(value, formData, fieldKey);
      } else {
        formData.append(fieldKey, value);
      }
    });
  } else if (parentKey) {
    formData.append(parentKey, data);
  }
  return formData;
};

export { api, extractErrorMessage, getAuthHeaders, buildFormData };
