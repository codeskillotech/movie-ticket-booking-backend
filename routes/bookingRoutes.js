// routes/bookingRoutes.js
const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookedSeats,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// User: create booking (needs login)
router.post("/", protect, createBooking);

// User: get own bookings
router.get("/my", protect, getMyBookings);

// Public: booked seats for a specific show (used for seat layout)
router.get("/booked-seats", getBookedSeats);

module.exports = router;
