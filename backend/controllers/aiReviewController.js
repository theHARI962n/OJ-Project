// backend/controllers/aiReviewController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiReview = async (req, res) => {
  try {
    const { code, problemTitle, problemDescription } = req.body;

    if (!code || code.trim() === "") {
      // No code entered → give problem-solving intuition
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const prompt = `
      The user has NOT entered any code.
      The problem is titled: "${problemTitle}".
      Description: ${problemDescription}.
      Give them **only hints and intuition** for solving this problem in 3 bullet points.
      Do NOT reveal exact code.
      `;

      const result = await model.generateContent(prompt);
      return res.json({
        review: null,
        hints: result.response.text(),
      });
    }

    // If code exists → give structured review
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
    You are an AI code reviewer.
    Review the following code for the problem: "${problemTitle}".
    Problem description: ${problemDescription}.
    Code:
    ${code}

    Give output in **structured format**:
    1. Review: (2 concise sentences about the quality of the code)
    2. Hints: (2–3 bullet points for improving the code or solving the problem better)
    Do NOT give the complete solution or exact code.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try to split the AI's text into review & hints
    const reviewMatch = text.match(/Review:(.*?)(Hints:|$)/s);
    const hintsMatch = text.match(/Hints:(.*)/s);

    res.json({
      review: reviewMatch ? reviewMatch[1].trim() : "",
      hints: hintsMatch ? hintsMatch[1].trim() : "",
    });

  } catch (error) {
    console.error("AI Review Error:", error);
    res.status(500).json({ message: "Failed to get AI review" });
  }
};

module.exports = { aiReview };
