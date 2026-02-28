const db = require('../config/db');

// 1. เพิ่มสินค้าใหม่ (รองรับการอัปโหลดรูปภาพ)
exports.createProduct = async (req, res) => {
    // ⚠️ สังเกตว่าเราเอา image_url ออกจาก req.body เพราะรูปภาพจะมากับ req.file แทนครับ
    const { name, description, price, stock_qty, category_id } = req.body;
    const user_id = req.user.id;

    try {
        const [shops] = await db.query('SELECT id FROM shops WHERE owner_id = ?', [user_id]);
        if (shops.length === 0) {
            return res.status(400).json({ message: 'คุณต้องเปิดร้านค้าก่อนลงขายสินค้า' });
        }
        const shop_id = shops[0].id;

        // 🔥 เช็คว่ามีการแนบไฟล์รูปมาไหม ถ้ามีให้สร้าง path เก็บไว้ ถ้าไม่มีก็ให้เป็น null (หรือใช้ข้อความเดิมเผื่อไว้)
        let image_url = req.body.image_url || null; 
        if (req.file) {
            // สร้าง URL ของรูปภาพเพื่อให้หน้าเว็บดึงไปแสดงผลได้
            image_url = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await db.query(
            'INSERT INTO products (shop_id, name, description, price, stock_qty, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [shop_id, name, description, price, stock_qty, category_id || null, image_url]
        );

        res.status(201).json({ message: 'เพิ่มสินค้าและอัปโหลดรูปภาพสำเร็จ!' });

    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. ดึงสินค้าทั้งหมดของร้านฉัน (Dashboard) 
// 🔥 เปลี่ยนชื่อเป็น getSellerProducts เพื่อให้ตรงกับ Route ในหน้าเว็บ
exports.getSellerProducts = async (req, res) => {
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
        console.error("Get Seller Products Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 3. ฟังก์ชันลบสินค้า
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const seller_id = req.user.id; 

    try {
        // เช็คก่อนว่าสินค้านี้เป็นของร้านเขาจริงไหม
        const [product] = await db.query(
            'SELECT p.* FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = ? AND s.owner_id = ?',
            [id, seller_id]
        );

        if (product.length === 0) {
            return res.status(403).json({ message: 'คุณไม่มีสิทธิ์ลบสินค้านี้' });
        }

        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'ลบสินค้าเรียบร้อยแล้ว!' });
        
    } catch (error) {
        console.error("Delete Product Error:", error);
        // 🔥 ดัก Error กรณีติด Foreign Key (มีคนซื้อสินค้านี้ไปแล้ว ฐานข้อมูลจะห้ามลบ)
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(400).json({ 
                message: 'ไม่สามารถลบได้ เนื่องจากสินค้านี้อยู่ในประวัติการสั่งซื้อของลูกค้าแล้ว (แนะนำให้แก้ไขจำนวนสต็อกเป็น 0 แทน)' 
            });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. ฟังก์ชันแก้ไขสินค้า (รองรับการแก้ไขรูปภาพ)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock_qty } = req.body;
    const seller_id = req.user.id;

    try {
        const [product] = await db.query(
            'SELECT p.* FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = ? AND s.owner_id = ?',
            [id, seller_id]
        );

        if (product.length === 0) {
            return res.status(403).json({ message: 'คุณไม่มีสิทธิ์แก้ไขสินค้านี้' });
        }

        // 🔥 ถ้ามีการอัปโหลดรูปใหม่ ให้ใช้ path รูปใหม่ ถ้าไม่มีให้ใช้รูปเดิม (จาก req.body หรือข้อมูลเก่า)
        let image_url = req.body.image_url || product[0].image_url;
        if (req.file) {
            image_url = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock_qty = ?, image_url = ? WHERE id = ?',
            [name, description || null, price, stock_qty, image_url, id]
        );
        res.json({ message: 'อัปเดตข้อมูลสินค้าสำเร็จ!' });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 5. ดึงสินค้าทั้งหมด (หน้า Home)
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
        console.error("Get All Products Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 6. ดึงข้อมูลสินค้าชิ้นเดียวตาม ID
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
        console.error("Get Product By ID Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};