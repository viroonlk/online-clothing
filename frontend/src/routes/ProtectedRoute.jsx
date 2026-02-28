import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// 🔥 เพิ่ม props ที่ชื่อว่า children เข้ามา
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    // 1. ถ้ายังไม่ได้ล็อกอิน (ไม่มี user) ให้เตะไปหน้า Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. ถ้ามีการระบุ Role และ Role ของ user ไม่อยู่ในรายชื่อที่อนุญาต ให้เตะกลับไปหน้า Home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        alert('⛔ คุณไม่มีสิทธิ์เข้าถึงหน้านี้!');
        return <Navigate to="/" replace />;
    }

    // 3. ถ้าผ่านเงื่อนไขทั้งหมด ให้แสดงผล Component ที่อยู่ข้างใน (เช่น AdminDashboard)
    return children;
};

export default ProtectedRoute;