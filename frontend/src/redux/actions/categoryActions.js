import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  bulkUpdateCategoryStatusApi, // ✅ Import the new bulk update API function
} from "../../api/categoryApi";

/*
 * ✅ Fetch All Categories Thunk
 */
export const fetchCategoriesThunk = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await fetchCategoriesApi();
      return categories;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

/*
 * ✅ Create Category Thunk
 */
export const createCategoryThunk = createAsyncThunk(
  "categories/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const newCategory = await createCategoryApi(categoryData);
      return newCategory;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create category");
    }
  }
);

/*
 * ✅ Update Category Thunk
 */
export const updateCategoryThunk = createAsyncThunk(
  "categories/update",
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const updatedCategory = await updateCategoryApi(categoryId, categoryData);
      return updatedCategory;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update category");
    }
  }
);

/*
 * ✅ Delete Category Thunk
 */
export const deleteCategoryThunk = createAsyncThunk(
  "categories/delete",
  async (categoryId, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete category");
    }
  }
);

/*
 * ✅ Bulk Update Categories Thunk
 */
export const bulkUpdateCategoryStatusThunk = createAsyncThunk(
  "categories/bulkUpdateStatus",
  async (updateData, { rejectWithValue }) => {
    try {
      const updatedCategories = await bulkUpdateCategoryStatusApi(updateData);
      return updatedCategories;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to bulk update categories");
    }
  }
);
