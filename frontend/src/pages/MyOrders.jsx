import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                // เรียก API ที่เราเพิ่งสร้าง
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    // ฟังก์ชันแปลสถานะเป็นภาษาไทยให้ดูสวยงาม
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">รอชำระเงิน</span>;
            case 'paid': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">ชำระเงินแล้ว</span>;
            case 'shipped': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">จัดส่งแล้ว</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">ยกเลิกแล้ว</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">{status || 'รอดำเนินการ'}</span>;
        }
    };

    if (loading) return <div className="p-10 text-center text-xl">กำลังโหลดข้อมูล...</div>;

    if (orders.length === 0) {
        return (
            <div className="container mx-auto p-10 text-center mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 คุณยังไม่มีประวัติการสั่งซื้อ</h2>
                <Link to="/" className="text-orange-500 underline hover:text-orange-600">กลับไปเลือกซื้อสินค้ากันเลย!</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">ประวัติการสั่งซื้อของฉัน 📦</h1>
            
            <div className="flex flex-col gap-6">
                {orders.map(order => (
                    <div key={order.order_id} className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                        {/* หัวบิล (Header) */}
                        <div className="bg-gray-50 border-b p-4 flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <p className="text-sm text-gray-500">หมายเลขคำสั่งซื้อ</p>
                                <p className="font-bold text-gray-800">#{order.order_id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">วันที่สั่งซื้อ</p>
                                <p className="font-medium text-gray-700">
                                    {new Date(order.order_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">สถานะ</p>
                                {getStatusColor(order.status)}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">ยอดรวมทั้งสิ้น</p>
                                <p className="font-bold text-xl text-orange-600">฿{Number(order.total_amount).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* รายการสินค้าข้างใน (Body) */}
                        <div className="p-4 flex flex-col gap-4">
                            {order.items.map(item => (
                                <div key={item.order_item_id} className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0">
                                    <img 
                                        src={item.image_url || "https://via.placeholder.com/80"} 
                                        alt={item.name} 
                                        className="w-16 h-16 object-contain bg-gray-50 rounded border p-1"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-500">จำนวน: {item.quantity} ชิ้น</p>
                                    </div>
                                    <div className="font-bold text-gray-700">
                                        ฿{(item.price_at_purchase * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ที่อยู่จัดส่ง (Footer) */}
                        <div className="bg-orange-50 text-sm text-gray-700 p-4 border-t">
                            <span className="font-bold text-orange-600">📍 จัดส่งไปที่: </span> 
                            {order.shipping_address}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;