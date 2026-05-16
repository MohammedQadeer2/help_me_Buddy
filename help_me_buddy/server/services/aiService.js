const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

const analyzeQuery = async (userInput) => {
    try {
        const prompt = `
You are an AI assistant for a service booking app.

Classify the user's problem into a service category.

Available categories:
Plumber, Electrician, AC Repair, Cleaner, Beautician, Carpenter, Mechanic

User input:
"${userInput}"

Return ONLY JSON:
{
  "category": "",
  "keywords": [],
  "urgency": ""
}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const cleaned = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("AI Error:", error);
        return null;
    }
};

module.exports = { analyzeQuery };