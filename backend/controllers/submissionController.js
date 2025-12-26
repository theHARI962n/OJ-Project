const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

const COMPILER_URL = process.env.COMPILER_URL;
console.log("📌 Using COMPILER_URL:", COMPILER_URL);

const submitCode = async (req, res) => {
  const { code, language, problemId } = req.body;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const problem = await Problem.findById(problemId);

    if (!problem || !problem.testCases?.length) {
      return res.status(400).json({ message: "No test cases found" });
    }

    let allPassed = true;
    const testResults = [];

    for (const tc of problem.testCases) {
      const response = await axios.post(`${COMPILER_URL}/run`, {
        language,
        code,
        input: tc.input.trim() + "\n",
      });

      const normalize = (str = "") =>
        str.replace(/\r\n/g, "\n").trim();

      const actualOutput = normalize(response.data.output);
      const expectedOutput = normalize(tc.expectedOutput);

      console.log("INPUT:", tc.input);
      console.log("EXPECTED:", JSON.stringify(expectedOutput));
      console.log("ACTUAL:", JSON.stringify(actualOutput));

      const passed = actualOutput === expectedOutput;
      if (!passed) allPassed = false;

      testResults.push({
        input: tc.input,
        expectedOutput,
        actualOutput,
        isCorrect: passed,
      });
    }

    // ✅ DEFINE verdict ONCE
    const verdict = allPassed ? "✅ Passed" : "❌ Failed";

    // ✅ SAVE TO DB
    const submission = await Submission.create({
      problemId,
      userId: req.user.userId,
      code,
      language,
      verdict,
      isCorrect: allPassed,
      testResults,
    });

    // ✅ SEND RESPONSE ONCE
    return res.status(201).json({
      submission: {
        verdict,
        testResults,
      },
    });

  } catch (error) {
    console.error("❌ SUBMISSION ERROR:", error.message);
    return res.status(500).json({
      message: "Submission failed",
      error: error.message,
    });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.userId })
      .populate("problemId")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching submissions",
      error: err.message,
    });
  }
};

module.exports = {
  submitCode,
  getUserSubmissions,
};
