const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Route สำหรับดึงข้อมูลสถิติ
router.get('/stats', authenticateToken, adminController.getDashboardStats);

// Route สำหรับดึงรายชื่อผู้ใช้
router.get('/users', authenticateToken, adminController.getAllUsers);

module.exports = router;