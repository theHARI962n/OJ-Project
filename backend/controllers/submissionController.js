const axios = require('axios');

const submitCode = async (req, res) => {
  const { code, language, input, expectedOutput, problemId } = req.body;

  try {
    // Send code to compiler microservice
    const response = await axios.post('http://localhost:8000/run', {
      language,
      code,
      input
    });

    const actualOutput = response.data.output.trim();
    const isCorrect = actualOutput === expectedOutput.trim();

    res.status(200).json({
      problemId,
      input,
      expectedOutput,
      actualOutput,
      isCorrect,
      verdict: isCorrect ? '✅ Passed' : '❌ Failed'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Compilation or execution failed',
      error: error.message
    });
  }
};

module.exports = { submitCode };
