import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token } = useContext(AuthContext);

    // 1. ถ้าไม่มี Token (ยังไม่ล็อกอิน) -> ดีดไปหน้า Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. ถ้ามี User ข้อมูลมาแล้ว แต่ Role ไม่ตรงกับที่อนุญาต -> ดีดไปหน้าแรก (หรือหน้า unauthorized)
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // 3. ถ้าผ่านทุกเงื่อนไข -> ปล่อยให้เข้าหน้านั้นได้
    return children;
};

export default ProtectedRoute;