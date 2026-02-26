const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

// === โซนสำหรับคนขาย (Seller) ===
// ดึงออเดอร์ของร้านตัวเอง
router.get('/seller-orders', authenticateToken, orderController.getSellerOrders);
// อัปเดตสถานะออเดอร์
router.put('/:id/status', authenticateToken, orderController.updateOrderStatus);


// === โซนสำหรับลูกค้า (Customer) ===
// ดึงประวัติการสั่งซื้อของฉัน
router.get('/my-orders', authenticateToken, orderController.getMyOrders);
// สร้างคำสั่งซื้อใหม่
router.post('/', authenticateToken, orderController.createOrder);


module.exports = router;