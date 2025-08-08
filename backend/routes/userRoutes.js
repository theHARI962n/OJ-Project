const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Submission = require('../models/Submission');

// GET profile of logged-in user
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email');

    // Count unique problems solved correctly
    const solvedProblems = await Submission.distinct("problemId", {
      userId: req.user.userId,
      isCorrect: true
    });

    res.json({
      name: user.name,
      email: user.email,
      totalSolved: solvedProblems.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;
