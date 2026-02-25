import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    return (
        <div className="p-10 bg-purple-100 min-h-screen">
            <h1 className="text-3xl font-bold text-purple-800">หน้าผู้ดูแล (Admin Dashboard)</h1>
            <p className="mt-4">ยินดีต้อนรับแอดมิน! ดูแลความเรียบร้อยของระบบที่นี่</p>
            <button onClick={logout} className="mt-6 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
    );
};
export default AdminDashboard;