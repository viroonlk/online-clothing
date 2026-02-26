import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // ฟังก์ชันดึงออเดอร์ของร้าน
    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/seller-orders');
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching seller orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ฟังก์ชันอัปเดตสถานะ
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            alert('✅ อัปเดตสถานะเรียบร้อยแล้ว!');
            fetchOrders(); // รีเฟรชข้อมูลใหม่หลังจากอัปเดตเสร็จ
        } catch (error) {
            console.error("Error updating status", error);
            alert('❌ เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
    };

    if (loading) return <div className="p-10 text-center text-xl font-bold">กำลังโหลดข้อมูลคำสั่งซื้อ...</div>;

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">🏪 จัดการคำสั่งซื้อ (Seller Dashboard)</h1>
                <Link to="/seller/add-product" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition shadow-md">
                    + เพิ่มสินค้าใหม่
                </Link>
            </div>
            
            {orders.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl shadow-sm border text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">ยังไม่มีคำสั่งซื้อเข้ามา 😢</h2>
                    <p className="text-gray-500">โปรโมทร้านค้าของคุณเพิ่มเติมเพื่อให้ลูกค้าเห็นสินค้ามากขึ้นนะ!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map(order => (
                        <div key={order.order_id} className="bg-white border-2 rounded-2xl shadow-sm overflow-hidden">
                            {/* ส่วนหัวของออเดอร์ */}
                            <div className="bg-gray-50 border-b p-5 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">หมายเลขคำสั่งซื้อ</p>
                                    <p className="font-bold text-lg text-gray-800">#{order.order_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">วันที่สั่งซื้อ</p>
                                    <p className="font-medium text-gray-700">
                                        {new Date(order.order_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">ยอดรวมทั้งสิ้น</p>
                                    <p className="font-bold text-xl text-orange-600">฿{Number(order.total_amount).toLocaleString()}</p>
                                </div>
                                
                                {/* 🔥 Dropdown สำหรับเปลี่ยนสถานะ */}
                                <div className="bg-white p-2 rounded-lg border shadow-sm">
                                    <label className="text-xs text-gray-500 font-bold block mb-1">ปรับสถานะออเดอร์:</label>
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                        className="bg-gray-50 border text-gray-800 font-bold rounded p-2 outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="pending">รอชำระเงิน</option>
                                        <option value="paid">ชำระเงินแล้ว</option>
                                        <option value="shipped">จัดส่งแล้ว</option>
                                        <option value="cancelled">ยกเลิกออเดอร์</option>
                                    </select>
                                </div>
                            </div>

                            {/* ส่วนข้อมูลลูกค้าและสินค้า */}
                            <div className="p-5 flex flex-col md:flex-row gap-8">
                                {/* ฝั่งซ้าย: ข้อมูลการจัดส่ง */}
                                <div className="md:w-1/3 border-r pr-6">
                                    <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">📍 ข้อมูลการจัดส่ง</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {order.shipping_address}
                                    </p>
                                </div>

                                {/* ฝั่งขวา: รายการสินค้า */}
                                <div className="md:w-2/3">
                                    <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">📦 รายการสินค้า ({order.items.length} รายการ)</h3>
                                    <div className="flex flex-col gap-3">
                                        {order.items.map(item => (
                                            <div key={item.order_item_id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={item.image_url || "https://via.placeholder.com/60"} 
                                                        alt={item.name} 
                                                        className="w-12 h-12 object-contain bg-white rounded border p-1"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                                        <p className="text-xs text-gray-500">จำนวน: {item.quantity} ชิ้น</p>
                                                    </div>
                                                </div>
                                                <div className="font-bold text-gray-700 text-sm">
                                                    ฿{(item.price_at_purchase * item.quantity).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;