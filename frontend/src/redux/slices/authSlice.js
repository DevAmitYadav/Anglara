import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  registerUserAction,
  loginUserAction,
  getUserAction,
  updateUserAction,
  deleteUserAction,
} from "../actions/authActions";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      state.error = null;
      state.success = false;
      toast.info("Logged out successfully!");
    },
    resetAuthState(state) {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── REGISTER USER ─────────────────────────────────────────────
      .addCase(registerUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        toast.success("Registration successful!");
      })
      .addCase(registerUserAction.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error.message || "Registration failed!";
        toast.error(state.error);
      })

      // ─── LOGIN USER ────────────────────────────────────────────────
      .addCase(loginUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );
        toast.success("Login successful!");
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error.message || "Login failed!";
        toast.error(state.error);
      })

      // ─── GET USER PROFILE ────────────────────────────────────────────
      .addCase(getUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Fetching user profile failed!";
        toast.error(state.error);
      })

      // ─── UPDATE USER PROFILE ─────────────────────────────────────────
      .addCase(updateUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Profile updated successfully!");
      })
      .addCase(updateUserAction.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Updating profile failed!";
        toast.error(state.error);
      })

      // ─── DELETE USER ─────────────────────────────────────────────────
      .addCase(deleteUserAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAction.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("User deleted successfully!");
      })
      .addCase(deleteUserAction.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Deleting user failed!";
        toast.error(state.error);
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
