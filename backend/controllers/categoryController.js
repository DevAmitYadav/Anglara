import Category from "../models/Category.js";

// ─── Create Category (Optimized with Indexed Lookups) ─────────────────────────
export const createCategory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, parent } = req.body;

    // Check if category name already exists (Uses Indexed Query)
    const existingCategory = await Category.findOne({ name }).lean();
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    // Create the category
    const category = await Category.create({
      name,
      parent: parent || null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── Fetch All Categories in a Tree Structure (Optimized) ───────────────────
export const getCategories = async (req, res) => {
    try {
      const categories = await Category.find().lean(); // Use lean() for better performance
  
      // Convert flat array into a tree
      const categoryMap = new Map();
      categories.forEach((cat) => categoryMap.set(cat._id.toString(), { ...cat, subcategories: [] }));
  
      const categoryTree = [];
      categories.forEach((cat) => {
        if (cat.parent) {
          categoryMap.get(cat.parent.toString())?.subcategories.push(categoryMap.get(cat._id.toString()));
        } else {
          categoryTree.push(categoryMap.get(cat._id.toString()));
        }
      });
  
      res.json({ success: true, categories: categoryTree });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

// ─── Update Category (Optimized for Performance) ────────────────────────────
export const updateCategory = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const { id } = req.params;
      const { name, status } = req.body;
  
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      if (name) {
        // Check for existing category with the same name (case-insensitive)
        const existingCategory = await Category.findOne({
          _id: { $ne: id }, // Exclude current category
          name: { $regex: new RegExp(`^${name}$`, "i") },
        }).lean();
  
        if (existingCategory) {
          return res.status(400).json({ success: false, message: "Category name already exists" });
        }
        category.name = name;
      }
  
      if (status) category.status = status;
  
      await category.save();
      res.json({ success: true, message: "Category updated successfully", category });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

// ─── Bulk Update Category Status ─────────────────────────────────────────────
export const bulkUpdateCategoryStatus = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const { categoryIds, status } = req.body;
  
      if (!categoryIds || !Array.isArray(categoryIds) || !status) {
        return res.status(400).json({ success: false, message: "Invalid request data" });
      }
  
      // Update multiple categories at once
      const result = await Category.updateMany(
        { _id: { $in: categoryIds } },
        { $set: { status } }
      );
  
      res.json({ success: true, message: "Categories updated successfully", modifiedCount: result.modifiedCount });
    } catch (error) {
      console.error("Error updating categories:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

// ─── Delete Category (Optimized with Bulk Update) ───────────────────────────
export const deleteCategory = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const { id } = req.params;
  
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      // Reassign subcategories before deleting the category
      await Category.updateMany({ parent: id }, { parent: category.parent });
  
      // Delete category
      await Category.findByIdAndDelete(id);
  
      res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
