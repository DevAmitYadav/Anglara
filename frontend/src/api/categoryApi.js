import { api, extractErrorMessage } from "./api";
import API_ENDPOINTS from "./endpoints";

// ─── Fetch All Categories (With Optimized Query Support) ─────────────
export const fetchCategoriesApi = async (params = {}) => {
  try {
    console.log("🔍 Fetching Categories with params:", params);
    const response = await api.get(API_ENDPOINTS.CATEGORY.GET_ALL, { params });
    return response.data.categories;
  } catch (error) {
    const message = extractErrorMessage(error);
    console.error("❌ Fetch Categories Error:", message);
    throw new Error(message);
  }
};

// ─── Create New Category ─────────────────────────────────────────────
export const createCategoryApi = async (categoryData) => {
  try {
    console.log("📝 Creating Category...", categoryData);
    const response = await api.post(API_ENDPOINTS.CATEGORY.CREATE, categoryData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.category;
  } catch (error) {
    const message = extractErrorMessage(error);
    console.error("❌ Create Category Error:", message);
    throw new Error(message);
  }
};

// ─── Update Category by ID ───────────────────────────────────────────
export const updateCategoryApi = async (categoryId, categoryData) => {
  try {
    console.log(`✏️ Updating Category ID: ${categoryId}`, categoryData);
    const response = await api.put(
      API_ENDPOINTS.CATEGORY.UPDATE(categoryId),
      categoryData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.category;
  } catch (error) {
    const message = extractErrorMessage(error);
    console.error("❌ Update Category Error:", message);
    throw new Error(message);
  }
};

// ─── Bulk Update Category Status ─────────────────────────────────────
export const bulkUpdateCategoryStatusApi = async (categoryIds, newStatus) => {
  try {
    console.log("🔄 Bulk Updating Categories...", { categoryIds, newStatus });
    const response = await api.patch(API_ENDPOINTS.CATEGORY.BULK_UPDATE_STATUS, {
      categoryIds,
      status: newStatus,
    });
    return response.data.updatedCategories;
  } catch (error) {
    const message = extractErrorMessage(error);
    console.error("❌ Bulk Update Error:", message);
    throw new Error(message);
  }
};

// ─── Delete Category by ID ───────────────────────────────────────────
export const deleteCategoryApi = async (categoryId) => {
  try {
    console.log(`🗑️ Deleting Category ID: ${categoryId}`);
    await api.delete(API_ENDPOINTS.CATEGORY.DELETE(categoryId));
    return categoryId;
  } catch (error) {
    const message = extractErrorMessage(error);
    console.error("❌ Delete Category Error:", message);
    throw new Error(message);
  }
};
