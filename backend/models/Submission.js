const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  input: String,
  expectedOutput: String,
  actualOutput: String,
  isCorrect: Boolean,
  verdict: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
