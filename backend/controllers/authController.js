const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// 1. ฟังก์ชันสมัครสมาชิก (Register)
exports.register = async (req, res) => {
    const { username, email, password, role, phone_number } = req.body;

    try {
        // เช็คก่อนว่า Email นี้มีคนใช้หรือยัง
        const [existingUser] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // เข้ารหัสรหัสผ่าน (เพื่อความปลอดภัย ไม่เก็บเป็น text ธรรมดา)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // บันทึกลงฐานข้อมูล
        // หมายเหตุ: กำหนด role เริ่มต้นเป็น 'customer' ถ้าไม่ได้ส่งมา
        const userRole = role || 'customer'; 
        
        await db.query(
            'INSERT INTO users (username, email, password_hash, role, phone_number) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, userRole, phone_number]
        );

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 2. ฟังก์ชันเข้าสู่ระบบ (Login)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // หา User จาก Email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // ตรวจสอบรหัสผ่าน (เทียบรหัสที่ส่งมา กับรหัสที่เข้ารหัสไว้ใน DB)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // สร้าง Token (กุญแจ) แจกให้ User เก็บไว้
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'secret_key_123456', // ควรเก็บใน .env
            { expiresIn: '1d' } // Token หมดอายุใน 1 วัน
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};