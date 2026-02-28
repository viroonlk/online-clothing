const db = require('../config/db');

// 1. ฟังก์ชันสร้างคำสั่งซื้อ (สำหรับลูกค้า)
exports.createOrder = async (req, res) => {
    const { cartItems, totalAmount, shippingAddress } = req.body;
    const user_id = req.user.id; 

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'ตะกร้าสินค้าว่างเปล่า' });
    }

    try {
        const shop_id = cartItems[0].shop_id; 

        if (!shop_id) {
            return res.status(400).json({ message: 'ข้อมูลร้านค้าไม่สมบูรณ์' });
        }

        // บันทึกลงตาราง orders
        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, shop_id, total_amount, shipping_address, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, shop_id, totalAmount, shippingAddress, 'pending']
        );
        
        const newOrderId = orderResult.insertId; 

        for (const item of cartItems) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [newOrderId, item.id, item.qty, item.price]
            );

            // 🔥 ใช้ products (มี s) ตามที่คุณยืนยัน
            await db.query(
                'UPDATE products SET stock_qty = stock_qty - ? WHERE id = ?',
                [item.qty, item.id]
            );
        }

        res.status(201).json({ message: 'สั่งซื้อสำเร็จ!', order_id: newOrderId });

    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสั่งซื้อ', error: error.sqlMessage || error.message });
    }
};

// 2. ดึงประวัติการสั่งซื้อ (สำหรับลูกค้า)
exports.getMyOrders = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY 1 DESC',
            [user_id]
        );

        if (orders.length === 0) return res.json([]);

        const orderIds = orders.map(o => o.order_id || o.id);

        const [items] = await db.query(
            `SELECT oi.*, p.name, p.image_url 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id IN (?)`,
            [orderIds]
        );

        res.json(orders.map(order => {
            const currentId = order.order_id || order.id;
            return {
                ...order,
                order_id: currentId,
                items: items.filter(item => item.order_id === currentId)
            };
        }));
    } catch (error) {
        console.error("Get My Orders Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 3. ดึงออเดอร์ของร้าน (สำหรับคนขาย)
exports.getSellerOrders = async (req, res) => {
    const seller_id = req.user.id;

    try {
        // 🔥 ใช้ shops (มี s) และ owner_id ตามโครงสร้างตารางของคุณ
        const [shops] = await db.query('SELECT id FROM shops WHERE owner_id = ?', [seller_id]);
        
        if (shops.length === 0) return res.status(404).json({ message: 'ไม่พบร้านค้าของคุณ' });
        
        const shop_id = shops[0].id;
        const [orders] = await db.query('SELECT * FROM orders WHERE shop_id = ? ORDER BY 1 DESC', [shop_id]);

        if (orders.length === 0) return res.json([]);

        const orderIds = orders.map(o => o.order_id || o.id);
        
        // 🔥 เปลี่ยน JOIN เป็น products (มี s)
        const [items] = await db.query(
            `SELECT oi.*, p.name, p.image_url FROM order_items oi 
             JOIN products p ON oi.product_id = p.id WHERE oi.order_id IN (?)`,
            [orderIds]
        );

        res.json(orders.map(order => {
            const currentId = order.order_id || order.id;
            return {
                ...order,
                order_id: currentId,
                items: items.filter(item => item.order_id === currentId)
            };
        }));
    } catch (error) {
        console.error("Get Seller Orders Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. อัปเดตสถานะออเดอร์
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // 🔥 เปลี่ยนตรงนี้ เอา OR order_id = ? ออกไปเลยครับ
        await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );
        res.json({ message: 'อัปเดตสถานะเรียบร้อย!' });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};