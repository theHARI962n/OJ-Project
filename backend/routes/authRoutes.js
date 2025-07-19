// backend/routes/authRoutes.js
const { protect, isAdmin } = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, (req, res) => {
    res.json({ message: 'Protected route accessed ✅', user: req.user });
  });
  
  router.get('/admin-test', protect, isAdmin, (req, res) => {
    res.json({ message: 'Admin route accessed ✅' });
  });


module.exports = router;
