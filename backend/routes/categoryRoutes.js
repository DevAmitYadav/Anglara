import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  bulkUpdateCategoryStatus,
} from "../controllers/categoryController.js";

const router = express.Router();

/**
 * @route   POST /api/categories
 * @desc    Create a new category (Admins Only)
 * @access  Private (Admin)
 */
router.post("/", protectRoute(["Admin"]), createCategory);

/**
 * @route   GET /api/categories
 * @desc    Fetch all categories in a tree structure
 * @access  Private (Authenticated Users)
 */
router.get("/", protectRoute(["admin"]), getCategories);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category (name/status) - Admins Only
 * @access  Private (Admin)
 */
router.put("/:id", protectRoute(["Admin"]), updateCategory);

/**
 * @route   PUT /api/categories/bulk-update
 * @desc    Bulk update category status (Active/Inactive)
 * @access  Private (Admin)
 */
router.put("/bulk-update", protectRoute(["Admin"]), bulkUpdateCategoryStatus);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category and reassign subcategories - Admins Only
 * @access  Private (Admin)
 */
router.delete("/:id", protectRoute(["Admin"]), deleteCategory);

export default router;
