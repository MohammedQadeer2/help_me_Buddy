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