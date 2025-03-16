import { api, extractErrorMessage, getAuthHeaders, buildFormData } from "./api";
import API_ENDPOINTS from "./endpoints";

// 🔹 Register User (uses FormData for file uploads and other data)
export const registerUserApi = async (userData) => {
  try {
    // Build FormData from userData (this handles file uploads automatically)
    const formData = buildFormData(userData);

    // Allow the browser to auto-set Content-Type (multipart/form-data with boundary)
    const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, formData, {
      headers: {
        ...getAuthHeaders(),
        // No explicit "Content-Type" header.
      },
    });
    console.log("User Data:", data);
    return data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

// 🔹 Login User (sending JSON)
export const loginUserApi = async (credentials) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

// 🔹 Get User Profile
export const getUserApi = async (id) => {
  try {
    const { data } = await api.get(API_ENDPOINTS.USER.GET(id), {
      headers: getAuthHeaders(),
    });
    return data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

// 🔹 Update User Profile (supports file upload if image is a File)
export const updateUserApi = async (id, userData) => {
  try {
    const isMultipart = userData.image && userData.image instanceof File;
    const headers = isMultipart
      ? {
          ...getAuthHeaders(),
          // Leave out "Content-Type" so that the multipart boundary is set automatically.
        }
      : { ...getAuthHeaders(), "Content-Type": "application/json" };

    const payload = isMultipart ? buildFormData(userData) : userData;
    const { data } = await api.put(API_ENDPOINTS.USER.UPDATE(id), payload, {
      headers,
    });
    // Update local storage with the new user data.
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};

// 🔹 Delete User
export const deleteUserApi = async (id) => {
  try {
    await api.delete(API_ENDPOINTS.USER.DELETE(id), {
      headers: getAuthHeaders(),
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return id;
  } catch (error) {
    throw extractErrorMessage(error);
  }
};
