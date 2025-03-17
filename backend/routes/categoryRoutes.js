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
router.post("/", protectRoute(["admin"]), createCategory);

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
router.put("/:id", protectRoute(["admin"]), updateCategory);

/**
 * @route   PUT /api/categories/bulk-update
 * @desc    Bulk update category status (Active/Inactive)
 * @access  Private (Admin)
 */
router.put("/bulk-update", protectRoute(["admin"]), bulkUpdateCategoryStatus);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category and reassign subcategories - Admins Only
 * @access  Private (Admin)
 */
router.delete("/:id", protectRoute(["admin"]), deleteCategory);

export default router;
