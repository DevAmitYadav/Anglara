import { Route, Routes } from "react-router-dom"; // ✅ Remove HashRouter from here
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import Categories from "./pages/Categories";
import CustomerForm from "./pages/CustomerForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-16">
        <Routes> {/* ✅ Keep only Routes here */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customerForm" element={<CustomerForm />} />

          {/* Protected route for Categories */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized Access */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
