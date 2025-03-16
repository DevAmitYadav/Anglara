// api.js

import axios from "axios";
import API_ENDPOINTS from "./endpoints"; // Ensure this file has your API endpoints

// ─── Base URL Configuration ───────────────────────────────────────────────
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://anglara-backend.onrender.com/api" // Production API
    : "http://localhost:5000/api"; // Local development API

// ─── Create Axios Instance ────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Extract Error Message ────────────────────────────────────────────────
const extractErrorMessage = (error) => {
  return (
    error?.response?.data?.errors?.[0]?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "An unknown error occurred"
  );
};

// ─── Get Authorization Headers ─────────────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Refresh Token Function ───────────────────────────────────────────────
const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    if (!refreshTokenValue) {
      throw new Error("No refresh token found");
    }

    const { data } = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      token: refreshTokenValue,
    });

    const newToken = data.newToken || data.token;
    if (!newToken) {
      throw new Error("New token not provided");
    }

    localStorage.setItem("token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    return newToken;
  } catch (error) {
    console.error("❌ Token refresh failed:", extractErrorMessage(error));
    logoutUser();
    return null;
  }
};

// ─── Logout Function ───────────────────────────────────────────────────────
const logoutUser = () => {
  localStorage.clear(); // Clears all stored user data
  window.location.replace("/login"); // Forces a full page reload to login
};

// ─── Request Interceptor ──────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor for Token Refresh ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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

// ─── FormData Builder Helper ──────────────────────────────────────────────
const buildFormData = (data, formData = new FormData(), parentKey = "") => {
  if (data && typeof data === "object" && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
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

export { api, extractErrorMessage, getAuthHeaders, buildFormData, logoutUser };
