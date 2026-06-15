const express = require('express');
const router  = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/user.Controller');
const { protect } = require('../middleware/authMiddleware');


// GET  /api/users/me, get the logged-in user's profile
router.get('/me', protect, getProfile);

// PUT  /api/users/me, update name, phone, avatar
router.put('/me', protect, updateProfile);

// PUT  /api/users/me/password, change password (requires old password verification)
router.put('/me/password', protect, changePassword);

module.exports = router;