import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true, // 🔹 Index for fast lookups
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true, // 🔹 Optimized for hierarchical queries
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true, // 🔹 Faster filtering
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔹 Optimized for user-based lookups
    },
  },
  { timestamps: true }
);

// 🔹 Compound Indexes for Performance Boost
categorySchema.index({ name: 1, createdBy: 1 }); // Ensures unique names per user
categorySchema.index({ parent: 1, status: 1 }); // Faster hierarchical filtering
categorySchema.index({ status: 1, createdBy: 1 }); // Quick status filtering per user

const Category = mongoose.model("Category", categorySchema);
export default Category;
