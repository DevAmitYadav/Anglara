import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  deleteUserApi,
} from "../../api/authApi";

// Improved error extractor to handle various error shapes
const extractErrorMessage = (error, fallbackMessage) => {
  if (error?.response && error.response.data) {
    if (error.response.data.message) return error.response.data.message;
    if (typeof error.response.data === "string") return error.response.data;
  }
  return error?.message || fallbackMessage || "An unexpected error occurred.";
};

// 🔹 Register User Action
export const registerUserAction = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Registration failed!")
      );
    }
  }
);

// 🔹 Login User Action
export const loginUserAction = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Login failed!")
      );
    }
  }
);

// 🔹 Get User Profile Action
export const getUserAction = createAsyncThunk(
  "auth/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUserApi(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Fetching user profile failed!")
      );
    }
  }
);

// 🔹 Update User Profile Action
export const updateUserAction = createAsyncThunk(
  "auth/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(id, userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Updating profile failed!")
      );
    }
  }
);

// 🔹 Delete User Action
export const deleteUserAction = createAsyncThunk(
  "auth/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteUserApi(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Deleting user failed!")
      );
    }
  }
);
