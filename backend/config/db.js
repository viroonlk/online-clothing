const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    // 🔥 บรรทัดนี้สำคัญมาก! Aiven บังคับให้เข้ารหัส SSL
    ssl: {
        rejectUnauthorized: false
    }
});

pool.getConnection()
    .then(() => console.log('✅ Connected to Aiven Cloud Database successfully!'))
    .catch((err) => console.error('❌ Database Connection Failed:', err));

module.exports = pool;