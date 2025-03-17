import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategoriesThunk,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
  bulkUpdateCategoryStatusThunk,
} from "../actions/categoryActions";

// ─── Initial State ──────────────────────────────────────────────────
const initialState = {
  categories: [],
  isLoading: false,
  error: null,
};

// ─── Category Slice ─────────────────────────────────────────────────
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch All Categories
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        console.log("Fetched categories:", action.payload); // Debugging log
        state.isLoading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        console.error("Fetch categories error:", action.payload); // Debugging log
        state.isLoading = false;
        state.error = action.payload;
      })
      // ✅ Create Category
      .addCase(createCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) state.categories.push(action.payload);
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ✅ Update Category
      .addCase(updateCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload?._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ✅ Delete Category
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ✅ Bulk Update Category Status (Fixed)
      .addCase(bulkUpdateCategoryStatusThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkUpdateCategoryStatusThunk.fulfilled, (state, action) => {
        console.log("Bulk Update Payload:", action.payload); // Debugging log
        state.isLoading = false;

        // ✅ Ensure action.payload is an array before using .forEach()
        const updatedCategories = Array.isArray(action.payload) ? action.payload : [];

        updatedCategories.forEach((updatedCategory) => {
          const index = state.categories.findIndex(
            (cat) => cat._id === updatedCategory._id
          );
          if (index !== -1) {
            state.categories[index].status = updatedCategory.status;
          }
        });
      })
      .addCase(bulkUpdateCategoryStatusThunk.rejected, (state, action) => {
        console.error("Bulk update error:", action.payload); // Debugging log
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
