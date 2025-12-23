const axios = require('axios');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

const COMPILER_URL = process.env.COMPILER_URL;

// 🔒 Fail fast if compiler URL is missing
if (!COMPILER_URL) {
  throw new Error("COMPILER_URL is not defined in environment variables");
}

const submitCode = async (req, res) => {
  const { code, language, problemId } = req.body;

  // 🔒 Ensure user is authenticated
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const problem = await Problem.findById(problemId);

    if (!problem || !problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({
        message: "No test cases found for this problem"
      });
    }

    let allPassed = true;
    let testResults = [];

    for (let tc of problem.testCases) {
      console.log("➡️ Calling compiler /run");

      const response = await axios.post(`${COMPILER_URL}/run`, {
        language,
        code,
        input: tc.input
      });

      // 🛡 Safe output handling
      const actualOutput = (response.data.output || "").trim();
      const expectedOutput = (tc.expectedOutput || "").trim();

      const passed = actualOutput === expectedOutput;
      if (!passed) allPassed = false;

      testResults.push({
        input: tc.input,
        expectedOutput,
        actualOutput,
        isCorrect: passed
      });
    }

    const verdict = allPassed ? "✅ Passed" : "❌ Failed";

    // 💾 Save submission
    const submission = await Submission.create({
      problemId,
      userId: req.user.userId,
      code,
      language,
      input: testResults[testResults.length - 1].input,
      expectedOutput: testResults[testResults.length - 1].expectedOutput,
      actualOutput: testResults[testResults.length - 1].actualOutput,
      isCorrect: allPassed,
      verdict,
      testResults
    });

    console.log("✅ Submission saved");

    res.status(201).json({
      message: "Submission saved✅",
      submission: {
        ...submission.toObject(),
        testResults
      }
    });

  } catch (error) {
    console.error("❌ SUBMISSION ERROR");

    if (error.response) {
      console.error("Compiler response:", error.response.data);
      console.error("Status:", error.response.status);
    } else {
      console.error("Error message:", error.message);
    }

    res.status(500).json({
      message: "Submission failed❌",
      error: error.message
    });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission
      .find({ userId: req.user.userId })
      .populate('problemId')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching submissions",
      error: err.message
    });
  }
};

module.exports = {
  submitCode,
  getUserSubmissions
};
