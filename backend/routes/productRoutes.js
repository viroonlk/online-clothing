const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 🔥 1. Import ตัวจัดการไฟล์ (Multer) ที่เราสร้างไว้
const upload = require('../middleware/uploadMiddleware');

// ==========================================
// 🔓 โซน Public (ไม่ต้อง Login เข้าถึงได้)
// ==========================================
router.get('/', productController.getAllProducts); 

// ==========================================
// 🔐 โซน Private (ต้อง Login / เฉพาะ Seller)
// ==========================================
router.get('/seller-products', authenticateToken, productController.getSellerProducts);
router.get('/:id', productController.getProductById);

// ==========================================
// 🔐 โซน จัดการสินค้า (อัปเดตให้รองรับการอัปโหลดไฟล์ด้วย upload.single)
// ==========================================

// 🔥 2. เพิ่ม upload.single('image') เข้าไปคั่นกลาง (รับไฟล์รูปภาพจากฟิลด์ชื่อ 'image')
router.post('/', authenticateToken, upload.single('image'), productController.createProduct);
router.put('/:id', authenticateToken, upload.single('image'), productController.updateProduct);

router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;