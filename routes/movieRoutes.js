// src/routes/movieRoutes.js
const express = require("express");
const {
  createMovie,
  getMovies,
  getMovieById,
  searchMovies,
} = require("../controllers/movieController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin: create movie
router.post("/",  protect, adminOnly, createMovie);

// Public: list movies with filters
router.get("/", getMovies);

// Public: single movie detail
router.get("/:id", getMovieById);
router.get("/search/title", searchMovies); 
module.exports = router;
