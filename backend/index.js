const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // <--- 1. เพิ่มบรรทัดนี้
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
// ... (โค้ด Test Route เดิมปล่อยไว้ได้ หรือจะลบก็ได้) ...

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});