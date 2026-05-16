const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
} = require("../controllers/bookingController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ================================
// CREATE BOOKING
// ================================
router.post("/", protect, createBooking);

// ================================
// GET MY BOOKINGS
// ================================
router.get("/my", protect, getMyBookings);

module.exports = router;