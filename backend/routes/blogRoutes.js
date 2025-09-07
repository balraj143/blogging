// routes/blogs.js
import express from "express";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ----------------- Create Blog (Protected) ----------------- */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;

    const newBlog = new Blog({
      title,
      content,
      image,
      tags,
      author: req.user._id,
    });

    await newBlog.save();

    const populated = await Blog.findById(newBlog.id)
      .populate("author", "name email username")
      .populate("comments.user", "name email");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Create Blog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Get All Blogs ----------------- */
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("author", "name email role")
      .populate("comments.user", "name email");
    res.json(blogs);
  } catch (err) {
    console.error("Get Blogs Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Search Blogs ----------------- */
router.get("/search", async (req, res) => {
  try {
    const { query, tag } = req.query;
    const filters = {};

    if (query) {
      filters.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    if (tag) {
      filters.tags = { $in: [tag] };
    }

    const blogs = await Blog.find(filters)
      .sort({ createdAt: -1 })
      .populate("author", "name email role");

    res.json(blogs);
  } catch (err) {
    console.error("Search Blogs Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Get Saved Blogs ----------------- */
router.get("/saved/list", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "savedBlogs",
        select: "title content author createdAt",
        populate: { path: "author", select: "name email role" },
      });

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.savedBlogs);
  } catch (err) {
    console.error("Get Saved Blogs Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Get My Blogs ----------------- */
router.get("/myblogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate("author", "name email role")
      .populate("comments.user", "name email");
    res.json(blogs);
  } catch (err) {
    console.error("Get My Blogs Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Get Single Blog ----------------- */
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email role")
      .populate("comments.user", "name email");
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error("Get Single Blog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Update Blog ----------------- */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // ✅ Only allow certain fields to be updated
    const { title, content, image, tags } = req.body;
    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (image !== undefined) blog.image = image;
    if (tags !== undefined) blog.tags = tags;

    await blog.save();

    const populated = await Blog.findById(blog.id)
      .populate("author", "name email role")
      .populate("comments.user", "name email");

    res.json(populated);
  } catch (err) {
    console.error("Update Blog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Delete Blog ----------------- */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await blog.deleteOne();
    res.json({ msg: "Blog deleted" });
  } catch (err) {
    console.error("Delete Blog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Like / Unlike ----------------- */
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const userId = req.user.id;
    const alreadyLiked = blog.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.addToSet(userId);
    }

    await blog.save();

    const populated = await Blog.findById(blog.id)
      .populate("author", "name email role")
      .populate("comments.user", "name email");

    res.json(populated);
  } catch (err) {
    console.error("Like Blog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Add Comment ----------------- */
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    if (!req.body.text?.trim()) {
      return res.status(400).json({ msg: "Comment text required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog.comments.push({
      user: req.user.id,
      text: req.body.text.trim(),
    });

    await blog.save();

    const populated = await Blog.findById(req.params.id)
      .populate("author", "name email role")
      .populate("comments.user", "name email");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Edit Comment ----------------- */
router.put("/:id/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    comment.text = req.body.text || comment.text;
    await blog.save();

    const populated = await Blog.findById(req.params.id)
      .populate("author", "name email role")
      .populate("comments.user", "name email");

    res.json(populated);
  } catch (err) {
    console.error("Edit Comment Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Delete Comment ----------------- */
router.delete("/:id/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    comment.deleteOne();
    await blog.save();

    const populated = await Blog.findById(req.params.id)
      .populate("author", "name email username")
      .populate("comments.user", "name email");

    res.json(populated);
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ----------------- Save / Unsave Blog ----------------- */
router.post("/:id/save", authMiddleware, async (req, res) => {
  try {
    const blogId = req.params.id;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const alreadySaved = user.savedBlogs.some(
      (id) => id.toString() === blogId.toString()
    );

    if (alreadySaved) {
      user.savedBlogs.pull(blogId);
      await user.save();
      return res.json({ msg: "Blog removed from saved list" });
    }

    user.savedBlogs.addToSet(blogId);
    await user.save();

    res.json({ msg: "Blog saved successfully" });
  } catch (err) {
    console.error("Save Blog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



// ⭐ Report a Blog
router.post("/:id/report", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    if (!reason || !reason.trim()) {
      return res.status(400).json({ msg: "Reason is required" });
    }

    // Check if already reported
    const alreadyReported = blog.reports.some(
      (r) => r.user.toString() === req.user.id
    );
    if (alreadyReported) {
      return res.status(400).json({ msg: "You already reported this blog" });
    }

    blog.reports.push({ user: req.user.id, reason });
    await blog.save();

    res.json({ msg: "Report submitted successfully" });
  } catch (err) {
    console.error("Error reporting blog:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;
