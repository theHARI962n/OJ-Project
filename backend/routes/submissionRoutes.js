const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitCode, getUserSubmissions } = require('../controllers/submissionController');

router.post('/', protect, submitCode);
router.get('/mine', protect, getUserSubmissions);

module.exports = router;
