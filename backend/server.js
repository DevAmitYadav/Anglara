import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"; // 🔹 Import Category Routes
import { errorMiddleware, notFoundMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";


dotenv.config();
connectDB();

const app = express();

// 🔹 Security Middlewares
app.use(helmet()); // Adds security headers
app.use(mongoSanitize()); // Prevents NoSQL injection
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit requests per IP
    message: "Too many requests from this IP, please try again later.",
  })
);

// 🔹 CORS Setup
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// 🔹 Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Serve Static Uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());

// 🔹 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes); 

// 🔹 Handle 404 Errors
app.use(notFoundMiddleware);

// 🔹 Handle Global Errors
app.use(errorMiddleware);

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
