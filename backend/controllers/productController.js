const db = require('../config/db');

// 1. เพิ่มสินค้าใหม่
exports.createProduct = async (req, res) => {
    const { name, description, price, stock_qty, category_id, image_url } = req.body;
    const user_id = req.user.id;

    try {
        const [shops] = await db.query('SELECT id FROM shops WHERE owner_id = ?', [user_id]);
        
        if (shops.length === 0) {
            return res.status(400).json({ message: 'คุณต้องเปิดร้านค้าก่อนลงขายสินค้า' });
        }
        
        const shop_id = shops[0].id;

        await db.query(
            'INSERT INTO products (shop_id, name, description, price, stock_qty, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [shop_id, name, description, price, stock_qty, category_id || null, image_url]
        );

        res.status(201).json({ message: 'เพิ่มสินค้าสำเร็จ' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. ดึงสินค้าทั้งหมดของร้านฉัน (Dashboard)
exports.getMyProducts = async (req, res) => {
    const user_id = req.user.id;
    try {
        const sql = `
            SELECT p.* FROM products p
            JOIN shops s ON p.shop_id = s.id
            WHERE s.owner_id = ?
            ORDER BY p.created_at DESC
        `;
        const [products] = await db.query(sql, [user_id]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 3. ลบสินค้า
exports.deleteProduct = async (req, res) => {
    const product_id = req.params.id;
    const user_id = req.user.id;

    try {
        const [check] = await db.query(`
            SELECT p.id FROM products p
            JOIN shops s ON p.shop_id = s.id
            WHERE p.id = ? AND s.owner_id = ?
        `, [product_id, user_id]);

        if (check.length === 0) {
            return res.status(403).json({ message: 'คุณไม่มีสิทธิ์ลบสินค้านี้' });
        }

        await db.query('DELETE FROM products WHERE id = ?', [product_id]);
        res.json({ message: 'ลบสินค้าสำเร็จ' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 4. ดึงสินค้าทั้งหมด (หน้า Home)
exports.getAllProducts = async (req, res) => {
    try {
        const sql = `
            SELECT p.*, s.shop_name 
            FROM products p
            JOIN shops s ON p.shop_id = s.id
            ORDER BY p.created_at DESC
        `;
        const [products] = await db.query(sql);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}; // <--- คุณลืมใส่ตัวนี้ในโค้ดที่ส่งมาครับ

// 5. ดึงข้อมูลสินค้าชิ้นเดียวตาม ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `
            SELECT p.*, s.shop_name 
            FROM products p
            JOIN shops s ON p.shop_id = s.id
            WHERE p.id = ?
        `;
        const [product] = await db.query(sql, [id]);
        
        if (product.length === 0) {
            return res.status(404).json({ message: 'ไม่พบสินค้า' });
        }
        res.json(product[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};