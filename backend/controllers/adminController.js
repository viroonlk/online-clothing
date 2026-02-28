const db = require('../config/db');

// 1. ดึงสถิติภาพรวมทั้งเว็บไซต์
exports.getDashboardStats = async (req, res) => {
    try {
        // นับจำนวนข้อมูลจากตารางต่างๆ (ใช้ชื่อตาราง shops และ products ของคุณ)
        const [[userCount]] = await db.query('SELECT COUNT(*) as total FROM users');
        const [[shopCount]] = await db.query('SELECT COUNT(*) as total FROM shops');
        const [[productCount]] = await db.query('SELECT COUNT(*) as total FROM products');
        const [[orderCount]] = await db.query('SELECT COUNT(*) as total FROM orders');

        res.json({
            totalUsers: userCount.total,
            totalShops: shopCount.total,
            totalProducts: productCount.total,
            totalOrders: orderCount.total
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. ดึงรายชื่อผู้ใช้งานทั้งหมด
exports.getAllUsers = async (req, res) => {
    try {
        // ⚠️ หมายเหตุ: ถ้าในตาราง users ของคุณใช้คำว่า 'name' แทน 'username' ให้แก้ตรงนี้นะครับ
        const [users] = await db.query('SELECT id, username, email, role FROM users ORDER BY id DESC');
        res.json(users);
    } catch (error) {
        console.error("Admin Get Users Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};