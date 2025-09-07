const express = require('express');
const router = express.Router();
const { validateLogin } = require('../middleware/validation');
const { authMiddleware } = require('../utils/jwt');
const authController = require('../controllers/authController');

// POST /api/auth/login - Login
router.post('/login', validateLogin, authController.login);

// GET /api/auth/me - Get current user profile
router.get('/me', authMiddleware, authController.getProfile);

// POST /api/auth/logout - Logout
router.post('/logout', authController.logout);

module.exports = router;
