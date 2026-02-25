const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 1. ดูสินค้าทั้งหมด (Public) - วางไว้บนสุดเพื่อให้ใครก็เข้าถึงได้
// เส้นทางนี้จะใช้สำหรับหน้า Home เพื่อดึงสินค้าจากทุกร้านมาโชว์
router.get('/', productController.getAllProducts); 

// --- ทุก Route ด้านล่างนี้ต้อง Login ก่อน (ผ่าน authenticateToken) ---

// 2. เพิ่มสินค้าใหม่ (เฉพาะ Seller)
router.post('/', authenticateToken, productController.createProduct);

// 3. ดูสินค้าเฉพาะของร้านตัวเอง (เฉพาะ Seller)
router.get('/my-products', authenticateToken, productController.getMyProducts);

// 4. ลบสินค้า (เฉพาะ Seller)
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;