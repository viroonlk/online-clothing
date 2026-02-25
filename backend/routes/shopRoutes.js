const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { authenticateToken } = require('../middleware/authMiddleware');

// ต้องผ่าน Middleware authenticateToken ก่อน ถึงจะเรียกใช้ได้
router.post('/', authenticateToken, shopController.createShop);
router.get('/me', authenticateToken, shopController.getMyShop);

module.exports = router;