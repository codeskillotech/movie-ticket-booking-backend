const express = require("express");
const { registerUser, loginUser, registerAdmin, getProfile, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);
router.post("/adminregister",  registerAdmin);
// POST /api/auth/login
router.post("/login", loginUser);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);

module.exports = router;
