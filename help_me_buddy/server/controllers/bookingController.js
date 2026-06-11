const Booking = require("../models/Booking");
const Provider = require("../models/Provider");
const ServiceCategory = require("../models/ServiceCategory");
const mongoose = require("mongoose");


// ================================
// CREATE BOOKING
// ================================
exports.createBooking = async (req, res) => {
  try {

    const {
      providerId,
      category,
      address,
      issueDescription,
      bookingDate,
      bookingTime,
      paymentMethod,
      userId: bodyUserId,
    } = req.body;

    const resolvedUserId = req.user?._id || bodyUserId;

    if (!resolvedUserId) {
      return res.status(401).json({
        message: "Not authorized. Please log in again.",
      });
    }

    if (!providerId || !address || !bookingDate || !bookingTime) {
      return res.status(400).json({
        message: "Missing required booking details.",
      });
    }

    // Find provider
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Resolve category to an ObjectId (handles name strings from UI)
    let resolvedCategory = category || provider.category;

    if (resolvedCategory && typeof resolvedCategory === "string" && !mongoose.Types.ObjectId.isValid(resolvedCategory)) {
      const matchedCategory = await ServiceCategory.findOne({
        name: { $regex: `^${resolvedCategory}$`, $options: "i" },
      }).select("_id");
      resolvedCategory = matchedCategory?._id || provider.category;
    }

    // Create booking
    const booking = await Booking.create({
      userId: resolvedUserId,
      providerId,
      category: resolvedCategory,
      address,
      issueDescription,
      bookingDate,
      bookingTime,

      // Copy provider price with fallback matching the frontend
      price: provider.pricePerHour || provider.price || 0,

      paymentMethod,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {

    console.error("Booking Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================================
// GET MY BOOKINGS
// ================================
exports.getMyBookings = async (req, res) => {
  try {
    // Fetch bookings for the logged-in user and populate provider details
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: "providerId",
        populate: { path: "userId", select: "name email phone" },
      })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================================
// GET BOOKINGS FOR LOGGED-IN PROVIDER
// ================================
exports.getProviderBookings = async (req, res) => {
  try {
    // Find provider profile linked to this user
    const provider = await Provider.findOne({ userId: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    // Fetch bookings assigned to this provider
    const bookings = await Booking.find({ providerId: provider._id })
      .populate("userId", "name email phone")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Provider Bookings Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================================
// UPDATE BOOKING STATUS BY PROVIDER
// ================================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Accepted",
      "Rejected",
      "On The Way",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find provider profile linked to this user
    const provider = await Provider.findOne({ userId: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    // Find the booking and ensure it belongs to this provider
    const booking = await Booking.findOne({ _id: id, providerId: provider._id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status
    booking.status = status;
    await booking.save();

    res.status(200).json({ message: "Status updated", booking });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};