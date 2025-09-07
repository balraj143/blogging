import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import User from "../models/User.js";
import Blog from "../models/Blog.js";

const router = express.Router();

// ----------------- Users -----------------

// Get all users (admin only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update user role (admin only)
router.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ msg: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ----------------- Blogs -----------------

// Get reported blogs (admin only)
router.get("/reported-blog", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reportedBlogs = await Blog.find({ "reports.0": { $exists: true } })
      .populate("author", "name email role")
      .populate("reports.user", "name  email");
    res.json(reportedBlogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete blog (admin only)
router.delete("/blogs/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Blog not found" });
    res.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// Edit any blog as admin
router.put("/blogs/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
