const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// --- เพิ่ม 3 บรรทัดนี้เพื่อเช็คค่า ---
console.log('Checking Env Variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER); // ถ้าขึ้น undefined แปลว่าอ่านไฟล์ไม่ได้
// --------------------------------

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;