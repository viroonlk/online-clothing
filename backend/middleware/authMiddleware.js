const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.authenticateToken = (req, res, next) => {
    // ดึง Token จาก Header (รูปแบบ: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123456', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        
        // ถ้าผ่าน ให้แปะข้อมูล user ลงไปใน request เพื่อให้ controller เอาไปใช้ต่อ
        req.user = user;
        next();
    });
};