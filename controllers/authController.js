const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js")

// helper: create JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    let {
      fullName,
      name,
      email,
      mobileNumber,
      password,
      confirmPassword,
    } = req.body;

    const finalName = fullName || name;

    if (
      !finalName ||
      !email ||
      !mobileNumber ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message:
          "Name, email, mobile number, password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name: finalName,
      email,
      mobileNumber,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Name, email, password and confirmPassword are required",
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "fullName email mobileNumber role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const logout = async (req, res) => {
  return res.json({
    message: "Logged out successfully."
  });
};
module.exports = {
  registerUser,
  loginUser,
  registerAdmin ,
  getProfile,
  logout
};
