// backend/controllers/problemController.js

const Problem = require('../models/Problem');

// @desc Create new problem
// @route POST /api/problems
// @access Private (admin only)
const createProblem = async (req, res) => {
  try {
    const { title, description, inputFormat, outputFormat, difficulty, tags } = req.body;

    const existing = await Problem.findOne({ title });
    if (existing) {
      return res.status(400).json({ message: 'Problem with this title already exists' });
    }

    const problem = await Problem.create({
      title,
      description,
      inputFormat,
      outputFormat,
      difficulty,
      tags,
      createdBy: req.user.userId
    });

    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating problem', error: err.message });
  }
};

// @desc Get all problems
// @route GET /api/problems
// @access Public
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch problems', error: err.message });
  }
};

// @desc Get single problem by ID
// @route GET /api/problems/:id
// @access Public
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problem', error: err.message });
  }
};

// @desc Update problem
// @route PUT /api/problems/:id
// @access Private (admin only)
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    Object.assign(problem, req.body);
    const updated = await problem.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating problem', error: err.message });
  }
};

// @desc Delete problem
// @route DELETE /api/problems/:id
// @access Private (admin only)
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting problem', error: err.message });
  }
};

module.exports = {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};
