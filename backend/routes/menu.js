const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/jwt');
const menuController = require('../controllers/menuController');

// GET /api/menu - Get menu items
router.get('/', authMiddleware, menuController.getMenuItems);

// GET /api/menu/categories - Get categories
router.get('/categories', authMiddleware, menuController.getCategories);

module.exports = router;
