const db = require('../config/db');

// สร้างร้านค้าใหม่
exports.createShop = async (req, res) => {
    const { shop_name, description } = req.body;
    const owner_id = req.user.id; // ได้มาจาก Middleware

    try {
        // เช็คก่อนว่าเคยมีร้านไหม (1 คน 1 ร้าน)
        const [existingShop] = await db.query('SELECT * FROM shops WHERE owner_id = ?', [owner_id]);
        if (existingShop.length > 0) {
            return res.status(400).json({ message: 'User already has a shop' });
        }

        await db.query(
            'INSERT INTO shops (owner_id, shop_name, description) VALUES (?, ?, ?)',
            [owner_id, shop_name, description]
        );

        res.status(201).json({ message: 'Shop created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ดึงข้อมูลร้านของฉัน
exports.getMyShop = async (req, res) => {
    const owner_id = req.user.id;
    try {
        const [shop] = await db.query('SELECT * FROM shops WHERE owner_id = ?', [owner_id]);
        if (shop.length === 0) {
            return res.status(404).json({ message: 'No shop found' }); // ยังไม่มีร้าน
        }
        res.json(shop[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};