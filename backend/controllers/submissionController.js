const axios = require('axios');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

const submitCode = async (req, res) => {
  const { code, language, problemId } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem || !problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({ message: 'No test cases found for this problem' });
    }

    let allPassed = true;
    let testResults = [];

for (let tc of problem.testCases) {
  const response = await axios.post('http://localhost:8000/run', {
    language,
    code,
    input: tc.input
  });

  const actualOutput = response.data.output.trim();
  const passed = actualOutput === tc.expectedOutput.trim();

  if (!passed) allPassed = false;

  testResults.push({
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    actualOutput,
    isCorrect: passed
  });
}

const verdict = allPassed ? "✅ Passed" : "❌ Failed";

// Save the submission
const submission = await Submission.create({
  problemId,
  userId: req.user.userId,
  code,
  language,
  // store just the last case for DB compatibility
  input: testResults[testResults.length - 1].input,
  expectedOutput: testResults[testResults.length - 1].expectedOutput,
  actualOutput: testResults[testResults.length - 1].actualOutput,
  isCorrect: allPassed,
  verdict,
  testResults // <-- store full array so we can return it
});

// Send full data to frontend
// Send full data to frontend, ensure testResults is included
console.log("Sending testResults:", testResults); // Debug log
res.status(201).json({
  message: 'Submission saved✅',
  submission: {
    ...submission.toObject(),
    testResults // force include array in API response
  }
});



  } catch (error) {
    res.status(500).json({
      message: 'Submission failed❌',
      error: error.message
    });
  }
};


const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.userId }).populate('problemId').sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions', error: err.message });
  }
};


module.exports = { submitCode,
  getUserSubmissions };

