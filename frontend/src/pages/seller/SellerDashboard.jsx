import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

const SellerDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // ฟอร์มสร้างร้าน
    const [formData, setFormData] = useState({ shop_name: '', description: '' });

    // 1. โหลดข้อมูลร้านเมื่อเข้าหน้าเว็บ
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const res = await api.get('/shops/me');
                setShop(res.data);
            } catch (error) {
                // ถ้า 404 แปลว่ายังไม่มีร้าน (ไม่เป็นไร)
                console.log("ยังไม่มีร้านค้า");
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, []);

    // 2. ฟังก์ชันกดสร้างร้าน
    const handleCreateShop = async (e) => {
        e.preventDefault();
        try {
            await api.post('/shops', formData);
            alert('สร้างร้านค้าสำเร็จ!');
            window.location.reload(); // รีโหลดให้เห็นหน้า Dashboard จริงๆ
        } catch (error) {
            alert('เกิดข้อผิดพลาด');
        }
    };

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>

            {/* เงื่อนไข: ถ้ามีร้านแล้ว แสดงข้อมูลร้าน */}
            {shop ? (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold text-green-600 mb-2">🏪 {shop.shop_name}</h2>
                    <p className="text-gray-600 mb-4">{shop.description}</p>
                    <hr className="my-4"/>
                    <div className="flex gap-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                            + เพิ่มสินค้าใหม่
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                            ดูสินค้าทั้งหมด
                        </button>
                    </div>
                </div>
            ) : (
                /* เงื่อนไข: ถ้ายังไม่มีร้าน แสดงฟอร์มสร้างร้าน */
                <div className="bg-white p-8 rounded shadow max-w-lg mx-auto border-t-4 border-orange-500">
                    <h2 className="text-2xl font-bold mb-4 text-center">🚀 เริ่มต้นเปิดร้านค้าของคุณ</h2>
                    <form onSubmit={handleCreateShop}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">ชื่อร้านค้า</label>
                            <input 
                                type="text" 
                                className="w-full border p-2 rounded" 
                                value={formData.shop_name}
                                onChange={(e) => setFormData({...formData, shop_name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">รายละเอียดร้าน</label>
                            <textarea 
                                className="w-full border p-2 rounded"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded font-bold hover:bg-orange-600">
                            ยืนยันการเปิดร้าน
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
export default SellerDashboard;