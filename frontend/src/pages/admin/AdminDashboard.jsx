import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalShops: 0, totalProducts: 0, totalOrders: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // ดึงข้อมูล 2 อย่างพร้อมกัน
                const [statsRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error("Error fetching admin data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) return <div className="p-10 text-center text-2xl font-bold text-gray-500">กำลังโหลดระบบผู้ดูแล... 🛡️</div>;

    return (
        <div className="container mx-auto p-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-200">
                <span className="text-4xl">🛡️</span>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">ศูนย์บัญชาการ (Admin Dashboard)</h1>
                    <p className="text-gray-500">ภาพรวมระบบร้านขายเสื้อผ้าออนไลน์ของคุณ</p>
                </div>
            </div>

            {/* 📊 สถิติภาพรวมทั้งแพลตฟอร์ม */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition">
                    <p className="text-blue-100 font-bold mb-1">ผู้ใช้งานทั้งหมด</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-4xl font-extrabold">{stats.totalUsers}</h3>
                        <span className="text-4xl opacity-80">👥</span>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition">
                    <p className="text-orange-100 font-bold mb-1">ร้านค้าในระบบ</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-4xl font-extrabold">{stats.totalShops}</h3>
                        <span className="text-4xl opacity-80">🏪</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition">
                    <p className="text-purple-100 font-bold mb-1">สินค้าทั้งหมด</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-4xl font-extrabold">{stats.totalProducts}</h3>
                        <span className="text-4xl opacity-80">👕</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition">
                    <p className="text-green-100 font-bold mb-1">ยอดสั่งซื้อรวม</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-4xl font-extrabold">{stats.totalOrders}</h3>
                        <span className="text-4xl opacity-80">🧾</span>
                    </div>
                </div>
            </div>

            {/* 📋 ตารางจัดการผู้ใช้งาน */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span>📝</span> รายชื่อผู้ใช้งานในระบบ
                </h2>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b-2 border-gray-200">
                                <th className="p-4 font-bold text-gray-600">ID</th>
                                <th className="p-4 font-bold text-gray-600">ชื่อผู้ใช้</th>
                                <th className="p-4 font-bold text-gray-600">อีเมล</th>
                                <th className="p-4 font-bold text-gray-600 text-center">บทบาท (Role)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="p-4 font-medium text-gray-500">#{user.id}</td>
                                    <td className="p-4 font-bold text-gray-800">{user.username || user.name || 'ไม่มีชื่อ'}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                            ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                                              user.role === 'seller' ? 'bg-orange-100 text-orange-700' : 
                                              'bg-blue-100 text-blue-700'}`}
                                        >
                                            {user.role || 'customer'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center p-8 text-gray-500">ยังไม่มีผู้ใช้งานในระบบ</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;