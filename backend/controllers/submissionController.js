const axios = require('axios');
const Submission = require('../models/Submission');

const submitCode = async (req, res) => {
  const { code, language, input, expectedOutput, problemId } = req.body;

  try {
    // 1. Send code to compiler service
    const response = await axios.post('http://localhost:8000/run', {
      language,
      code,
      input
    });

    const actualOutput = response.data.output.trim();
    const isCorrect = actualOutput === expectedOutput.trim();
    const verdict = isCorrect ? '✅ Passed' : '❌ Failed';

    // 2. Store in DB
    const submission = await Submission.create({
      problemId,
      userId: req.user.userId,
      code,
      language,
      input,
      expectedOutput,
      actualOutput,
      isCorrect,
      verdict
    });

    // 3. Return response
    res.status(201).json({
      message: 'Submission saved ✅',
      submission
    });

  } catch (error) {
    res.status(500).json({
      message: 'Submission failed ❌',
      error: error.message
    });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.userId }).populate('problemId');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions', error: err.message });
  }
};

module.exports = { submitCode,getUserSubmissions };
