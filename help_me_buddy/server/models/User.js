const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: ["user", "provider", "admin"],
      default: ["user"],
    },
    isProvider: {
      type: Boolean,
      default: false,
    },
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);