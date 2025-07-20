// backend/routes/problemRoutes.js

const express = require('express');
const router = express.Router();

const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} = require('../controllers/problemController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllProblems);
router.get('/:id', getProblemById);

// Protected routes (admin only)
router.post('/', protect, isAdmin, createProblem);
router.put('/:id', protect, isAdmin, updateProblem);
router.delete('/:id', protect, isAdmin, deleteProblem);

module.exports = router;
