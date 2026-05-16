const express = require("express");
const router = express.Router();
const { smartSearch } = require("../controllers/aiController");

router.post("/smart-search", smartSearch);

module.exports = router;