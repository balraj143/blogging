import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config({ override: true });
const app = express();

const allowedOrigins = [
  "http://localhost:5173", // or 3000 depending on your frontend dev server
  "https://blogging-frontend-dgq7.onrender.com"
];

// Middleware
app.use(cors({
  origin: "https://blogging-frontend-dgq7.onrender.com",
  credentials: true
}));
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Connect DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
