// controllers/bookingController.js
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");

// POST /api/bookings
// User creates a booking – pricePerSeat comes from Movie
const createBooking = async (req, res) => {
  try {
    const { movieId, showDate, showTime, seats } = req.body;

    if (!movieId || !showDate || !showTime || !seats || !seats.length) {
      return res.status(400).json({
        message: "movieId, showDate, showTime and seats are required",
      });
    }

    // 1) Make sure movie exists and has pricePerSeat
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (movie.pricePerSeat == null) {
      return res
        .status(400)
        .json({ message: "Price per seat not configured for this movie" });
    }

    const pricePerSeat = movie.pricePerSeat;

    // 2) Check if any of the requested seats are already booked
    const existingBookings = await Booking.find({
      movie: movieId,
      showDate,
      showTime,
      status: "confirmed",
      seats: { $in: seats },
    });

    if (existingBookings.length > 0) {
      const alreadyBooked = [
        ...new Set(existingBookings.flatMap((b) => b.seats)),
      ].filter((s) => seats.includes(s));

      return res.status(400).json({
        message: "Some seats are already booked",
        bookedSeats: alreadyBooked,
      });
    }

    // 3) Calculate total
    const totalAmount = pricePerSeat * seats.length;

    // 4) Create booking
    const booking = await Booking.create({
      user: req.user.id,
      movie: movieId,
      showDate,
      showTime,
      seats,
      pricePerSeat,
      totalAmount,
      status: "confirmed",
    });

    return res.status(201).json({
      message: "Booking confirmed",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/bookings/my
// Get bookings for logged-in user
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("movie", "title genre language")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    console.error("Get my bookings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/bookings/booked-seats?movieId=...&showDate=...&showTime=...
// For seat layout – returns already booked seats for that show
const getBookedSeats = async (req, res) => {
  try {
    const { movieId, showDate, showTime } = req.query;

    if (!movieId || !showDate || !showTime) {
      return res.status(400).json({
        message: "movieId, showDate and showTime are required",
      });
    }

    const bookings = await Booking.find({
      movie: movieId,
      showDate,
      showTime,
      status: "confirmed",
    });

    const bookedSeats = [
      ...new Set(bookings.flatMap((b) => b.seats)),
    ];

    return res.json({ bookedSeats });
  } catch (error) {
    console.error("Get booked seats error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookedSeats,
};
