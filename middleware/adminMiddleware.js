
const User = require("../models/User");

const adminOnly = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error("adminOnly error:", error);
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = { adminOnly };
