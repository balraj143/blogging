import jwt from "jsonwebtoken";
import User from "../models/User.js";   // ✅ import User model

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    // 🔑 Fetch user from DB to get role, name, etc.
    const user = await User.findById(decoded.id || decoded.user?.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });
    req.user = user; 
    // Attach user info to req.user
    // req.user = {
    //   id: user._id.toString(),
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,   // ✅ now role is available
    // };

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
