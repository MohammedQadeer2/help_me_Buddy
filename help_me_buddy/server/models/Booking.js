const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // User who booked the service
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Provider assigned to booking
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    // Service category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },

    // Address entered by user
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional issue description
    issueDescription: {
      type: String,
      trim: true,
    },

    // Booking date
    bookingDate: {
      type: String,
      required: true,
    },

    // Time slot
    bookingTime: {
      type: String,
      required: true,
    },

    // Estimated price
    price: {
      type: Number,
      default: 0,
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      default: "online",
    },
    
    // Booking status
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Completed",
        "Cancelled",
        "Rejected",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
