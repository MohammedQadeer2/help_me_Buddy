const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
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

// ================================
// GET BOOKINGS FOR LOGGED-IN PROVIDER
// ================================
router.get("/provider", protect, getProviderBookings);

// ================================
// UPDATE BOOKING STATUS
// ================================
router.patch("/:id/status", protect, updateBookingStatus);

module.exports = router;