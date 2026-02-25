import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg p-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                
                {/* 1. โลโก้และหน้าแรก */}
                <Link to="/" className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                    <span className="text-3xl">🛒</span> MyShop
                </Link>

                {/* 2. เมนูนำทางและส่วนผู้ใช้งาน */}
                <div className="flex items-center gap-6 font-medium">
                    <Link to="/" className="text-gray-600 hover:text-orange-500 transition">หน้าแรก</Link>
                    
                    {user ? (
                        /* กรณีล็อกอินแล้ว */
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-gray-400">สวัสดี,</span>
                                <span className="text-gray-800">{user.username}</span>
                            </div>

                            {/* ปุ่มเมนูตาม Role */}
                            {user.role === 'seller' && (
                                <Link 
                                    to="/seller/dashboard" 
                                    className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition"
                                >
                                    จัดการร้านค้า
                                </Link>
                            )}
                            
                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin/dashboard" 
                                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
                                >
                                    แอดมิน
                                </Link>
                            )}

                            <button 
                                onClick={handleLogout} 
                                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                            >
                                ออกจากระบบ
                            </button>
                        </div>
                    ) : (
                        /* กรณีที่ยังไม่ได้ล็อกอิน */
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-600 hover:text-orange-500 transition">เข้าสู่ระบบ</Link>
                            <Link 
                                to="/register" 
                                className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 shadow-md transition"
                            >
                                สมัครสมาชิก
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;