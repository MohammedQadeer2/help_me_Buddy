const { analyzeQuery } = require("../services/aiService");
const Provider = require("../models/Provider");

exports.smartSearch = async (req, res) => {
  try {
    const { query } = req.body;

    const aiResult = await analyzeQuery(query);
    console.log("AI Result:", aiResult);

    if (!aiResult) {
      return res.status(400).json({ message: "AI failed" });
    }

    // Find matching providers
    const providers = await Provider.find()
      .populate("userId", "-password") // 👈 ADD THIS
      .populate("category");

    console.log("All Providers:", providers[0]);

    const filtered = providers.filter(
      (p) => p.category?.name?.toLowerCase() === aiResult.category?.toLowerCase()
    );

    console.log("AI Result Category:", aiResult.category);

    console.log("Filtered Providers:", filtered);

    // Sort best match
    const topMatches = filtered
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    res.json({
      ai: aiResult,
      bestMatch: topMatches[0],
      suggestions: topMatches,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};