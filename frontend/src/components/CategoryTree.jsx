import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk
} from "../redux/actions/categoryActions";
import {
  Card,
  CardContent,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Pagination,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  ModeEditOutline,
  DeleteOutline,
  FolderOpen,
} from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const CategoryNode = ({ category }) => {
  const dispatch = useDispatch();
  const [editedStatus, setEditedStatus] = useState(category.status || "active");
  const [editedName, setEditedName] = useState(category.name);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    if (!editedName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
  
    setIsLoading(true);
    try {
      await dispatch(
        updateCategoryThunk({
          categoryId: category._id,
          categoryData: { name: editedName, status: editedStatus },
        })
      ).unwrap();
  
      // Recursive function to update subcategories
      const updateSubcategories = async (subcategories, status) => {
        for (const sub of subcategories) {
          await dispatch(
            updateCategoryThunk({
              categoryId: sub._id,
              categoryData: { status },
            })
          ).unwrap();
  
          if (sub.subcategories?.length > 0) {
            await updateSubcategories(sub.subcategories, status);
          }
        }
      };
  
      // If parent is set to inactive, update all children to inactive
      if (editedStatus === "inactive" && category.subcategories?.length > 0) {
        await updateSubcategories(category.subcategories, "inactive");
      }
  
      // If parent is set to active, update only inactive children to active
      if (editedStatus === "active" && category.subcategories?.length > 0) {
        await updateSubcategories(
          category.subcategories.filter((sub) => sub.status === "inactive"),
          "active"
        );
      }
  
      toast.success("Category updated successfully!");
      setIsEditing(false);
  
      // Refetch all categories to update UI instantly
      await dispatch(fetchCategoriesThunk());
    } catch (error) {
      toast.error(error || "Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  


  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsLoading(true);
      try {
        await dispatch(deleteCategoryThunk(category._id)).unwrap();
        toast.success("Category deleted successfully!");
  
        // Refetch categories to reflect changes
        await dispatch(fetchCategoriesThunk());
      } catch (error) {
        toast.error(error || "Failed to delete category");
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {category.subcategories && category.subcategories.length > 0 && (
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            size="small"
            sx={{ mr: 1 }}
          >
            {isExpanded ? (
              <KeyboardArrowDown fontSize="small" />
            ) : (
              <KeyboardArrowRight fontSize="small" />
            )}
          </IconButton>
        )}
        <Box sx={{ flex: 1 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              background: "white",
            }}
          >
            <CardContent
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {isEditing ? (
                <>
                  <TextField
                    label="Category Name"
                    variant="outlined"
                    fullWidth
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />

                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button
                      onClick={handleUpdate}
                      disabled={isLoading}
                      variant="contained"
                      startIcon={<CheckCircleOutlineIcon />}
                      sx={{
                        background: "linear-gradient(45deg, #00838f, #005662)",
                        color: "#fff",
                        textTransform: "none",
                        boxShadow: 2,
                        "&:hover": {
                          background: "linear-gradient(45deg, #005662, #00838f)",
                        },
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="contained"
                      startIcon={<CancelOutlinedIcon />}
                      sx={{
                        background: "linear-gradient(45deg, #424242, #212121)",
                        color: "#fff",
                        textTransform: "none",
                        boxShadow: 2,
                        "&:hover": {
                          background: "linear-gradient(45deg, #212121, #424242)",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mr: 2, // extra margin between category content and buttons
                    }}
                  >
                    <FolderOpen sx={{ color: "#424242", fontSize: "2rem" }} />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                      >
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "inline-block",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          border: "1px solid #ccc",
                          color:
                            category.status === "inactive"
                              ? "error.main"
                              : "text.primary",
                        }}
                      >
                        {category.status || "active"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="contained"
                      startIcon={<ModeEditOutline />}
                      sx={{
                        background: "linear-gradient(45deg, #FF9800, #F57C00)",
                        color: "#fff",
                        textTransform: "none",
                        boxShadow: 2,
                        "&:hover": {
                          background: "linear-gradient(45deg, #F57C00, #FF9800)",
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={isLoading}
                      variant="contained"
                      startIcon={<DeleteOutline />}
                      sx={{
                        background: "linear-gradient(45deg, #b71c1c, #7f0000)",
                        color: "#fff",
                        textTransform: "none",
                        boxShadow: 2,
                        "&:hover": {
                          background: "linear-gradient(45deg, #7f0000, #b71c1c)",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
      <AnimatePresence>
        {isExpanded &&
          category.subcategories &&
          category.subcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginLeft: "24px",
                borderLeft: "2px solid #1976D2",
                paddingLeft: "24px",
                marginTop: "16px",
              }}
            >
              {category.subcategories.map((sub) => (
                <CategoryNode key={sub._id} category={sub} />
              ))}
            </motion.div>
          )}
      </AnimatePresence>
    </Box>
  );
};
const CategoryTree = ({ categories }) => {
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Adjust as needed
    const totalPages = Math.ceil(categories.length / itemsPerPage);
  
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentCategories = categories.slice(startIdx, startIdx + itemsPerPage);
  
    const handlePageChange = (_, page) => setCurrentPage(page);
  
    return (
      <Box sx={{ maxWidth: "90%", mx: "auto", mt: 4, mb: 4 }}>
        {categories.length === 0 ? (
          <Box sx={{ textAlign: "center", color: "grey.600", mt: 4 }}>
            <img
              src="/assets/empty.svg"
              alt="No Data"
              style={{ width: "128px", marginBottom: "16px" }}
            />
            <Typography>No categories available.</Typography>
          </Box>
        ) : (
          <>
            {currentCategories.map((cat) => (
              <CategoryNode key={cat._id} category={cat} />
            ))}
  
            {/* Pagination Controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mt: 4,
                p: 2,
                borderRadius: "12px",
                backgroundColor: "rgba(0, 0, 0, 0.05)", // Light grey background
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
              }}
            >
              {/* Previous Button (Orange Gradient) */}
              <Button
                variant="contained"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                sx={{
                  background: currentPage === 1 ? "#BDBDBD" : "linear-gradient(45deg, #FF9800, #F57C00)", // Orange Gradient
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  px: 3,
                  py: 1.5,
                  transition: "0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#F57C00",
                  },
                }}
              >
                ← Previous
              </Button>
  
              {/* Page Numbers (MUI Pagination) */}
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    mx: 0.5,
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderRadius: 2,
                    padding: "8px",
                    color: "#424242",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#1976D2 !important", // Blue Primary color
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "8px",
                  },
                }}
              />
  
              {/* Next Button (Blue Gradient) */}
              <Button
                variant="contained"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                sx={{
                  background: currentPage === totalPages ? "#BDBDBD" : "linear-gradient(45deg, #1976D2, #1565C0)", // Blue Gradient
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  px: 3,
                  py: 1.5,
                  transition: "0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#1565C0",
                  },
                }}
              >
                Next →
              </Button>
            </Box>
          </>
        )}
      </Box>
  );
};

export default CategoryTree;
