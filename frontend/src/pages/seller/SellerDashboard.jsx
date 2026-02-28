import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ id: '', name: '', description: '', price: '', stock_qty: '', image_url: '' });
    
    // 🔥 1. สร้าง State ตัวใหม่สำหรับเก็บ "ไฟล์รูปภาพ" ที่คนขายเลือก
    const [editFile, setEditFile] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersRes, productsRes] = await Promise.all([
                api.get('/orders/seller-orders'),
                api.get('/products/seller-products')
            ]);
            setOrders(ordersRes.data);
            setMyProducts(productsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            alert('✅ อัปเดตสถานะเรียบร้อย!');
            fetchData(); 
        } catch (error) {
            alert('❌ เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('⚠️ คุณแน่ใจหรือไม่ที่จะลบสินค้านี้? ข้อมูลจะหายไปถาวร')) {
            try {
                await api.delete(`/products/${id}`);
                alert('🗑️ ลบสินค้าสำเร็จ!');
                fetchData();
            } catch (error) {
                alert('❌ ลบไม่สำเร็จ อาจเพราะมีลูกค้าสั่งซื้อสินค้านี้ไปแล้ว');
            }
        }
    };

    const openEditModal = (product) => {
        setEditForm(product);
        setEditFile(null); // เคลียร์ไฟล์เก่าออกทุกครั้งที่เปิด Modal
        setIsEditModalOpen(true);
    };

    // 🔥 2. แก้ไขฟังก์ชัน Update ให้แพ็คของใส่ FormData
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            // สร้างกล่องพัสดุ FormData
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('price', editForm.price);
            formData.append('stock_qty', editForm.stock_qty);
            if (editForm.description) formData.append('description', editForm.description);
            
            // ถ้ามีการเลือกไฟล์รูปภาพใหม่ ให้ยัดใส่กล่องไปด้วยในชื่อ 'image' (ต้องตรงกับฝั่ง Backend)
            if (editFile) {
                formData.append('image', editFile);
            }

            // ส่งข้อมูลไปแบบ multipart/form-data
            await api.put(`/products/${editForm.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('💾 อัปเดตข้อมูลและรูปภาพสำเร็จ!');
            setIsEditModalOpen(false);
            setEditFile(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('❌ อัปเดตไม่สำเร็จ');
        }
    };

    const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + Number(order.total_amount), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
    const totalProducts = myProducts.length;

    if (loading) return <div className="p-10 text-center text-xl font-bold">กำลังโหลดข้อมูลร้านค้า...</div>;

    return (
        <div className="container mx-auto p-8 max-w-7xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2">
                <h1 className="text-3xl font-bold text-gray-800">🏪 จัดการร้านค้า (Seller Dashboard)</h1>
                <Link to="/seller/add-product" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 shadow-md transition transform hover:scale-105">
                    + เพิ่มสินค้าใหม่
                </Link>
            </div>

            {/* 📊 Analytics Cards (โค้ดเดิม) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-green-500 flex justify-between">
                    <div><p className="text-sm font-bold text-gray-500">ยอดขายรวม</p><h3 className="text-2xl font-extrabold text-gray-800">฿{totalSales.toLocaleString()}</h3></div>
                    <div className="text-green-500 text-4xl">💰</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-blue-500 flex justify-between">
                    <div><p className="text-sm font-bold text-gray-500">คำสั่งซื้อทั้งหมด</p><h3 className="text-2xl font-extrabold text-gray-800">{totalOrders} รายการ</h3></div>
                    <div className="text-blue-500 text-4xl">📦</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-orange-500 flex justify-between">
                    <div><p className="text-sm font-bold text-gray-500">ต้องจัดส่ง</p><h3 className="text-2xl font-extrabold text-orange-600">{pendingOrders} ออเดอร์</h3></div>
                    <div className="text-orange-500 text-4xl">⏳</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-purple-500 flex justify-between">
                    <div><p className="text-sm font-bold text-gray-500">สินค้าในคลัง</p><h3 className="text-2xl font-extrabold text-gray-800">{totalProducts} ชิ้น</h3></div>
                    <div className="text-purple-500 text-4xl">🏷️</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* 🛒 จัดการออเดอร์ (โค้ดเดิม) */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span>📋</span> รายการสั่งซื้อล่าสุด</h2>
                    {orders.length === 0 ? <div className="bg-white p-6 rounded-xl border text-center text-gray-500">ยังไม่มีคำสั่งซื้อเข้ามา</div> : (
                        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                            {orders.map(order => (
                                <div key={order.order_id} className="bg-white border rounded-xl shadow-sm p-4">
                                    <div className="flex justify-between border-b pb-2 mb-2"><span className="font-bold text-gray-700">ออเดอร์ #{order.order_id}</span><span className="text-orange-600 font-bold">฿{Number(order.total_amount).toLocaleString()}</span></div>
                                    <div className="mb-3 text-sm text-gray-600"><p>📍 {order.shipping_address}</p><p>📅 {new Date(order.order_date || order.created_at).toLocaleString('th-TH')}</p></div>
                                    <select value={order.status} onChange={(e) => handleStatusChange(order.order_id, e.target.value)} className={`w-full border p-2 rounded text-sm font-bold outline-none ${order.status === 'shipped' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                        <option value="pending">รอชำระเงิน</option>
                                        <option value="paid">ชำระเงินแล้ว</option>
                                        <option value="shipped">จัดส่งแล้ว</option>
                                        <option value="cancelled">ยกเลิกออเดอร์</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🛍️ คลังสินค้าของฉัน (โค้ดเดิม) */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span>📦</span> คลังสินค้าของฉัน</h2>
                    {myProducts.length === 0 ? <div className="bg-white p-6 rounded-xl border text-center text-gray-500">ยังไม่มีสินค้าในร้าน</div> : (
                        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                            {myProducts.map(product => (
                                <div key={product.id} className="bg-white border rounded-xl shadow-sm p-4 flex gap-4 items-center hover:shadow-md transition">
                                    <img src={product.image_url || "https://via.placeholder.com/80"} alt={product.name} className="w-16 h-16 object-cover rounded-lg border" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">ราคา: <span className="text-orange-600 font-bold">฿{product.price}</span> | สต็อก: {product.stock_qty}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => openEditModal(product)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition border border-blue-200">✏️ แก้ไข</button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-100 transition border border-red-200">🗑️ ลบ</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 🛠️ 3. Modal สำหรับแก้ไขสินค้า (อัปเดตช่องใส่รูปภาพ) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">แก้ไขสินค้า</h2>
                        <form onSubmit={handleUpdateProduct} className="flex flex-col gap-3">
                            <div>
                                <label className="text-sm font-bold text-gray-700">ชื่อสินค้า</label>
                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full border p-2 rounded mt-1" required />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-bold text-gray-700">ราคา (บาท)</label>
                                    <input type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="w-full border p-2 rounded mt-1" required />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-bold text-gray-700">จำนวนสต็อก</label>
                                    <input type="number" value={editForm.stock_qty} onChange={(e) => setEditForm({...editForm, stock_qty: e.target.value})} className="w-full border p-2 rounded mt-1" required />
                                </div>
                            </div>
                            
                            {/* 🔥 เปลี่ยนจาก Input Text เป็น Input File */}
                            <div className="p-3 bg-gray-50 rounded-lg border">
                                <label className="text-sm font-bold text-gray-700 block mb-2">อัปโหลดรูปภาพใหม่ (ไม่บังคับ)</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => setEditFile(e.target.files[0])} 
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 outline-none" 
                                />
                                {/* โชว์รูปเดิมกันลืม */}
                                {editForm.image_url && !editFile && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="text-xs text-gray-500">รูปภาพปัจจุบัน:</span>
                                        <img src={editForm.image_url} alt="Current" className="h-12 w-12 object-cover rounded border border-gray-200 shadow-sm" />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition">บันทึกข้อมูล</button>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded hover:bg-gray-300 transition">ยกเลิก</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;