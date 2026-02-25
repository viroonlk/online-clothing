import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'; // (ถ้ามีหน้า Register แล้ว)
import SellerDashboard from './pages/seller/SellerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function Home() {
  return (
      <div className="p-10 text-center">
          <h1 className="text-3xl font-bold">หน้าแรก (สำหรับลูกค้าทั่วไป)</h1>
          <a href="/login" className="text-blue-500 underline block mt-4">ไปหน้า Login</a>
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 1. Public Routes (ใครก็เข้าได้) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* 2. Seller Routes (เข้าได้เฉพาะคนขาย) */}
        <Route 
          path="/seller/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 3. Admin Routes (เข้าได้เฉพาะแอดมิน) */}
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