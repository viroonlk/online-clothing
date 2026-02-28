import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// --- Components & Routes ---
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

// --- Pages ---
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/seller/AddProduct';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* วาง Navbar ไว้นอก Routes เพื่อให้แสดงในทุกหน้า */}
        <Navbar />

        <Routes>
          {/* ========================================== */}
          {/* 🔓 1. Public Routes (ใครก็เข้าได้) */}
          {/* ========================================== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} /> 

          {/* ========================================== */}
          {/* 🔐 2. Customer Routes (ต้อง Login) */}
          {/* ========================================== */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* ========================================== */}
          {/* 🏪 3. Seller Routes (เฉพาะคนขายและแอดมิน) */}
          {/* ========================================== */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/add-product"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          {/* ========================================== */}
          {/* 🛡️ 4. Admin Routes (เฉพาะแอดมินเท่านั้น) */}
          {/* ========================================== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;