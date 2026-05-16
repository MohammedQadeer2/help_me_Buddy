const express = require("express");
const router = express.Router();
const ServiceCategory = require("../models/ServiceCategory");

router.post("/", async (req, res) => {
  const category = await ServiceCategory.create(req.body);
  res.json(category);
});

router.get("/", async (req, res) => {
  const categories = await ServiceCategory.find();
  res.json(categories);
});

module.exports = router;