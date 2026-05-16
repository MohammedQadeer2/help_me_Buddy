const Provider = require("../models/Provider");
const User = require("../models/User");

// ➕ Create Provider Profile
exports.createProvider = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const existingProvider = await Provider.findOne({ userId: req.user._id });
    if (existingProvider) {
      return res.status(400).json({ message: "Provider profile already exists" });
    }

    const provider = await Provider.create({
      ...req.body,
      userId: req.user._id,
    });

    // Enable provider mode for the same user account
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { roles: "provider" },
        $set: { isProvider: true },
      },
      { new: true }
    );

    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔍 Get All Providers (FILTER + SEARCH + SORT)
exports.getProviders = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Search by name (via populated user)
    let providersQuery = Provider.find(query).populate("userId category");

    if (search) {
      providersQuery = providersQuery.find({
        $or: [
          { description: { $regex: search, $options: "i" } }
        ],
      });
    }

    // Sort by price
    if (sort === "low") {
      providersQuery = providersQuery.sort({ pricePerHour: 1 });
    } else if (sort === "high") {
      providersQuery = providersQuery.sort({ pricePerHour: -1 });
    }

    const providers = await providersQuery;

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔎 Get Single Provider (Details Page)
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate("userId category");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};