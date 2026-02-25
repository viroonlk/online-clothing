import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar'; // เพิ่ม Navbar เข้าไป
import Home from './pages/Home'; // ดึงหน้า Home จริงๆ มาใช้
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'; 
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/seller/AddProduct';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      {/* วาง Navbar ไว้นอก Routes เพื่อให้แสดงในทุกหน้า */}
      <Navbar /> 
      
      <Routes>
        {/* 1. Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. Seller Routes (ใช้ ProtectedRoute คุมสิทธิ์) */}
        <Route 
          path="/seller/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/seller/add-product" 
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <AddProduct />
            </ProtectedRoute>
          } 
        />

        {/* 3. Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;