// models/Movie.js
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    genre: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    pricePerSeat: {          // 👈 NEW FIELD
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
