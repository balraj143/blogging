// Ensure only admins can access
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "No user info, auth required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }

  next();
};

export default adminMiddleware;
