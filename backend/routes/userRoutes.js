import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Blog from "../models/Blog.js";

const router = express.Router();

// ⭐ Follow a user
router.post("/:id/follow", authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.id; // author to follow
    const currentUserId = req.user.id;  // logged-in user

    if (targetUserId === currentUserId) {
      return res.status(400).json({ msg: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // If already following → unfollow
    if (currentUser.following.includes(targetUserId)) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

      await currentUser.save();
      await targetUser.save();

      return res.json({ msg: "Unfollowed successfully" });
    }

    // Else → follow
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.json({ msg: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ⭐ Get followers of a user
router.get("/:id/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "name email");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ⭐ Get following of a user
router.get("/:id/following", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "name email");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ⭐ Get user profile with blogs, liked blogs, saved blogs
router.get("/:id/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
        .populate([
        { path: "savedBlogs", populate: { path: "author", select: "name" } },
        { path: "following", select: "name email" },
        { path: "followers", select: "name email" },
      ]);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Fetch blogs written by this user
    const blogs = await Blog.find({ author: req.params.id }).populate("author", "name");

    // Fetch liked blogs (if you store likes in Blog schema)
    const likedBlogs = await Blog.find({ likes: req.params.id }).populate("author", "name");

    res.json({
      user: {
        name: user.name,
        email: user.email,
        followers: user.followers,
        following: user.following,
      },
      blogs,
      likedBlogs,
      savedBlogs: user.savedBlogs,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


export default router;
