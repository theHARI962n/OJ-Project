const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiReview = async (req, res) => {
  try {
    const { code, problemTitle, problemDescription } = req.body;

    // ===== PROMPT =====
    const prompt = !code || code.trim() === ""
      ? `
The user has NOT written any code.

Problem Title: ${problemTitle}
Problem Description: ${problemDescription}

Give ONLY hints and intuition in exactly 3 bullet points.
Do NOT give code.
`
      : `
You are an AI code reviewer.

Problem Title: ${problemTitle}
Problem Description: ${problemDescription}

Code:
${code}

Respond ONLY in this format:

Review:
(2 short sentences)

Hints:
- point 1
- point 2
- point 3

Do NOT provide full solution or exact code.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // 🔥 cheap + powerful
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const text = completion.choices[0].message.content;

    const reviewMatch = text.match(/Review:(.*?)(Hints:|$)/s);
    const hintsMatch = text.match(/Hints:(.*)/s);

    res.json({
      review: reviewMatch ? reviewMatch[1].trim() : null,
      hints: hintsMatch ? hintsMatch[1].trim() : text,
    });

  } catch (error) {
    console.error("❌ AI Review Error:", error);
    res.status(500).json({ message: "AI review failed" });
  }
};

module.exports = { aiReview };
