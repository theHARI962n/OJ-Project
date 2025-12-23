const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

const COMPILER_URL = process.env.COMPILER_URL;

// Helper sleep to avoid relying on undefined globals
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!COMPILER_URL) {
  console.warn(
    "WARN: COMPILER_URL is not defined. Submissions will fail until this is configured."
  );
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
        message: "No test cases found for this problem",
      });
    }

    let allPassed = true;
    let testResults = [];

    if (!COMPILER_URL) {
      return res
        .status(500)
        .json({ message: "Compiler not configured on server" });
    }

    for (let tc of problem.testCases) {
      await sleep(1500);
      console.log("➡️ Calling compiler /run");

      try {
        // timeout so long-running/hung compiler requests fail fast
        const response = await axios.post(
          `${COMPILER_URL}/run`,
          {
            language,
            code,
            input: tc.input,
          },
          { timeout: 20000 }
        );

        // Log compiler response for easier debugging
        console.log("Compiler returned:", response.data);

        // 🛡 Safe output handling: prefer normal output, then stderr or error
        const actualOutput = (
          (response.data &&
            (response.data.output ||
              response.data.stderr ||
              response.data.error)) ||
          ""
        )
          .toString()
          .trim();
        const expectedOutput = (tc.expectedOutput || "").trim();

        const passed = actualOutput === expectedOutput;
        if (!passed) allPassed = false;

        testResults.push({
          input: tc.input,
          expectedOutput,
          actualOutput,
          isCorrect: passed,
        });
      } catch (err) {
        // If the compiler request fails for a specific test, record the error and continue
        console.error(
          "Compiler call failed for input:\n",
          tc.input,
          err.message || err
        );
        allPassed = false;

        let actualOutput = `Compiler error: ${err.message}`;
        if (err.code === "ECONNABORTED")
          actualOutput = "Compiler error: timeout";
        else if (err.response && err.response.data)
          actualOutput = `Compiler error: ${JSON.stringify(err.response.data)}`;

        testResults.push({
          input: tc.input,
          expectedOutput: (tc.expectedOutput || "").trim(),
          actualOutput,
          isCorrect: false,
        });
      }
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
      testResults,
    });

    console.log("✅ Submission saved");

    res.status(201).json({
      message: "Submission saved✅",
      submission: {
        ...submission.toObject(),
        testResults,
      },
    });
  } catch (error) {
    console.error("❌ SUBMISSION ERROR");

    if (error.response) {
      console.error("Compiler response:", error.response.data);
      console.error("Status:", error.response.status);
    } else {
      console.error("Error message:", error.message);
    }

    // Build a helpful message for the frontend. If the compiler returned a body, include it.
    const compilerInfo = error.response ? error.response.data : null;
    const message = compilerInfo
      ? `Submission failed: Compiler error - ${JSON.stringify(compilerInfo)}`
      : `Submission failed: ${error.message}`;

    res.status(500).json({
      message,
      error: error.message,
      compilerInfo,
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
