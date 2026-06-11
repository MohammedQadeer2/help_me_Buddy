const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const aiRoutes = require("./routes/aiRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceCategoryRoutes = require("./routes/serviceRoutes");

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:3000",
];

// CORS configuration to allow requests from the React frontend
app.use(
  cors({ origin: allowedOrigins, credentials: true })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/providers", providerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/service", serviceCategoryRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("Help Me Buddy API is running 🚀");
});

module.exports = app;