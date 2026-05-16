const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: String,
  keywords: [String],
});

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);