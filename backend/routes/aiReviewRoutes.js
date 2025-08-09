// backend/routes/aiReviewRoutes.js
const express = require("express");
const { aiReview } = require("../controllers/aiReviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/ai-review", protect, aiReview);

module.exports = router;
