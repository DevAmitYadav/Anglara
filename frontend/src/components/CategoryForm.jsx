import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategoryThunk,
  fetchCategoriesThunk,
} from "../redux/actions/categoryActions";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { Toaster, toast } from "sonner";

const CategoryForm = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("none");
  const [loading, setLoading] = useState(false);

  // Flatten categories while preserving hierarchy info
  const flattenCategories = (cats, level = 0) => {
    let result = [];
    cats.forEach((cat) => {
      result.push({
        _id: cat._id,
        name: cat.name,
        level,
        hasChildren: cat.subcategories && cat.subcategories.length > 0,
      });
      if (cat.subcategories && cat.subcategories.length > 0) {
        result = result.concat(flattenCategories(cat.subcategories, level + 1));
      }
    });
    return result;
  };

  const flatCategories = flattenCategories(categories);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setLoading(true);
    try {
      const payload = { name, parent: parent === "none" ? null : parent };
      await dispatch(createCategoryThunk(payload)).unwrap();
      toast.success("Category created successfully!");
      setName("");
      setParent("none");
      dispatch(fetchCategoriesThunk());
    } catch (error) {
      toast.error(error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
      <Toaster position="top-right" />
      {/* Gradient Border Wrapper */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #8E2DE2, #4A00E0)",
          p: "2px", // thickness of gradient border
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, boxShadow: 2, bgcolor: "white" }}
        >
          <CardHeader
            sx={{
              bgcolor: "white",
              borderBottom: "1px solid #ccc",
              textAlign: "center",
            }}
            title={
              <Typography variant="h6" sx={{ fontWeight: 700, color: "black" }}>
                Add New Category
              </Typography>
            }
          />
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {/* Category Name Field */}
              <TextField
                id="categoryName"
                label="Category Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
                InputLabelProps={{
                  style: { color: "black" },
                }}
                inputProps={{
                  style: { color: "black" },
                }}
              />

              {/* Parent Category Dropdown */}
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="parent-category-label" sx={{ color: "black" }}>
                  Parent Category (Optional)
                </InputLabel>
                <Select
                  labelId="parent-category-label"
                  id="parent-category-select"
                  value={parent}
                  label="Parent Category (Optional)"
                  onChange={(e) => setParent(e.target.value)}
                  sx={{ color: "black", borderColor: "black" }}
                >
                  <MenuItem value="none">
                    <em>None</em>
                  </MenuItem>
                  {flatCategories.map((cat) => (
                    <MenuItem
                      key={cat._id}
                      value={cat._id}
                      sx={{
                        pl: cat.level * 2,
                        color:
                          cat.level === 0
                            ? "black"
                            : cat.level % 2 === 0
                            ? "darkblue"
                            : "darkred",
                        fontWeight: cat.level === 0 ? "bold" : "medium",
                      }}
                    >
                      {cat.level > 0 && (cat.hasChildren ? "▸ " : "• ")}
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Submit Button with Modern Gradient */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  backgroundImage: "linear-gradient(90deg, #FF512F, #DD2476)",
                  color: "white",
                  boxShadow: 4,
                  "&:hover": {
                    backgroundImage: "linear-gradient(90deg, #DD2476, #FF512F)",
                  },
                }}
              >
                {loading ? "Adding..." : "Add Category"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CategoryForm;
