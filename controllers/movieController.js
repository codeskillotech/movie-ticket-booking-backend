// src/controllers/movieController.js
const Movie = require("../models/Movie");

// ADMIN: create movie
// POST /api/movies
const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      language,
      rating,
      durationMinutes,
      posterUrl,
      pricePerSeat,          // 👈 get from body
    } = req.body;

    if (
      !title ||
      !genre ||
      !language ||
      !durationMinutes ||
      !posterUrl ||
      pricePerSeat == null
    ) {
      return res.status(400).json({
        message:
          "Title, genre, language, durationMinutes, posterUrl and pricePerSeat are required",
      });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      language,
      rating: rating || 0,
      durationMinutes,
      posterUrl,
      pricePerSeat,          // 👈 save it
    });

    return res.status(201).json({
      message: "Movie created successfully",
      movie,
    });
  } catch (error) {
    console.error("Create movie error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC: get movies with filters
// GET /api/movies?search=&genre=&language=&minRating=
const getMovies = async (req, res) => {
  try {
    const { search, genre, language, minRating } = req.query;

    const filter = { isActive: true };

    if (genre && genre !== "All") {
      filter.genre = genre;
    }

    if (language && language !== "All") {
      filter.language = language;
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    return res.json(movies);
  } catch (error) {
    console.error("Get movies error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC: get single movie by id (for details / booking page)
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie || !movie.isActive) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json(movie);
  } catch (error) {
    console.error("Get movie by id error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const searchMovies = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search text (q) is required" });
    }

    const regex = new RegExp(q, "i"); // i = case-insensitive

    const movies = await Movie.find({
      isActive: true,
      title: { $regex: regex },
    }).sort({ createdAt: -1 });

    return res.json(movies);
  } catch (error) {
    console.error("Search movies error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createMovie,
  getMovies,
  getMovieById,
  searchMovies,
};
