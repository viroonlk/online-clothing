const multer = require('multer');
const path = require('path');

// 1. ตั้งค่าที่เก็บไฟล์และชื่อไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // ระบุให้เก็บไฟล์ไว้ในโฟลเดอร์ uploads ที่เราเพิ่งสร้าง
    },
    filename: function (req, file, cb) {
        // เปลี่ยนชื่อไฟล์ให้ไม่ซ้ำกัน โดยใช้วันเวลาปัจจุบัน (Timestamp) ต่อด้วยนามสกุลไฟล์เดิม
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// 2. ดักจับชนิดไฟล์ (รับเฉพาะรูปภาพ)
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|webp/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP) เท่านั้น!'));
    }
};

// 3. สร้างตัวแปร upload เพื่อเอาไปใช้งานต่อ
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ไม่เกิน 5MB
    fileFilter: fileFilter
});

module.exports = upload;