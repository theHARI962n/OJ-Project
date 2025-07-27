// compiler/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const runCode = require('./runCode');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/run', async (req, res) => {
  const { language, code, input } = req.body;
  try {
    const output = await runCode(language, code, input);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Compiler running on port ${PORT} 🚀`);
});
