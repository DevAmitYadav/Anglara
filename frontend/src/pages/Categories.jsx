import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesThunk } from "../redux/actions/categoryActions";
import CategoryTree from "../components/CategoryTree";
import CategoryForm from "../components/CategoryForm";
import { Card, CardContent } from "@/components/ui/card"; // ShadCN Card Component
import { Toaster, toast } from "sonner"; 

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state) => state.category);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesThunk());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 flex items-center justify-center px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-screen-xl mx-auto">
        {/* Title with Better Typography */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center mb-6 tracking-tight">
          Multi-Level Category Management
        </h1>

        {/* Responsive Card Container */}
        <Card className="w-full bg-white shadow-xl rounded-xl p-6 sm:p-10 transition-all duration-300 hover:shadow-2xl">
          <CardContent>
            {/* Grid Layout for Better Responsiveness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Category Form */}
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Category</h2>
                <CategoryForm />
              </div>

              {/* Right: Category List */}
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Category Tree</h2>
                {isLoading ? (
                  // ✅ Modern Animated Loader
                  <div className="flex justify-center items-center">
                    <div className="w-10 h-10 border-[5px] border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <p className="text-lg text-gray-500 italic">No categories available yet.</p>
                ) : (
                  <CategoryTree categories={categories} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categories;
