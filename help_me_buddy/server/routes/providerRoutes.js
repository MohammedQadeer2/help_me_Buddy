const express = require("express");
const router = express.Router();
const {
  createProvider,
  getProviders,
  getProviderById,
} = require("../controllers/providerController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProvider);
router.get("/", getProviders);
router.get("/:id", getProviderById);

module.exports = router;