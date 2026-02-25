const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// กำหนดเส้นทาง URL
// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;