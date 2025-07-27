const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitCode } = require('../controllers/submissionController');

router.post('/', protect, submitCode);

module.exports = router;
