import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // คำนวณยอดรวม
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // สร้าง State สำหรับเก็บข้อมูลฟอร์ม
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        addressDetail: '',
        subDistrict: '', // ตำบล
        district: '',    // อำเภอ
        province: '',    // จังหวัด
        zipCode: ''      // รหัสไปรษณีย์
    });

    // ถ้าแอบเข้าหน้านี้แต่ไม่มีของในตะกร้า ให้เด้งกลับไปหน้าตะกร้า
    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // นำข้อมูลทุกช่องมารวมกันเป็นข้อความเดียว เพื่อให้เข้ากับ Database เดิม
        const fullAddress = `ชื่อ: ${formData.fullName} โทร: ${formData.phone} ที่อยู่: ${formData.addressDetail} ต.${formData.subDistrict} อ.${formData.district} จ.${formData.province} ${formData.zipCode}`;

        try {
            const payload = {
                cartItems: cartItems,
                totalAmount: totalPrice,
                shippingAddress: fullAddress
            };

            // ส่งข้อมูลไป API ที่เราทำไว้
            const res = await api.post('/orders', payload);

            alert(`🎉 สั่งซื้อสำเร็จ! รหัสคำสั่งซื้อของคุณคือ: #${res.data.order_id}`);
            clearCart(); // ล้างตะกร้า
            navigate('/'); // กลับไปหน้าแรก

        } catch (error) {
            console.error("Checkout Error:", error);
            alert('❌ เกิดข้อผิดพลาด: ' + (error.response?.data?.error || error.response?.data?.message || 'เกิดข้อผิดพลาด'));
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">ยืนยันการสั่งซื้อ</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* ฝั่งซ้าย: ฟอร์มกรอกที่อยู่ */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                    <h2 className="text-xl font-bold mb-6 text-orange-600">📍 ข้อมูลการจัดส่ง</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm mb-2">ชื่อ-นามสกุล</label>
                                <input type="text" name="fullName" required onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:outline-orange-500" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm mb-2">เบอร์โทรศัพท์</label>
                                <input type="tel" name="phone" required onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:outline-orange-500" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2">บ้านเลขที่, ซอย, หมู่บ้าน, ถนน</label>
                            <input type="text" name="addressDetail" required onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:outline-orange-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm mb-2">ตำบล / แขวง</label>
                                <input type="text" name="subDistrict" required onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:outline-orange-500" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm mb-2">อำเภอ / เขต</label>
                                <input type="text" name="district" required onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:outline-orange-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-gray-700 text-sm mb-2">จังหวัด</label>
                                <input type="text" name="province" required onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:outline-orange-500" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm mb-2">รหัสไปรษณีย์</label>
                                <input type="text" name="zipCode" required onChange={handleChange} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:outline-orange-500" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-md">
                            ยืนยันการสั่งซื้อ
                        </button>
                    </form>
                </div>

                {/* ฝั่งขวา: สรุปยอดตะกร้า */}
                <div className="bg-gray-50 p-6 rounded-2xl border h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">สรุปคำสั่งซื้อ</h2>
                    <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                                <span className="text-gray-600 truncate max-w-[150px]">{item.name} (x{item.qty})</span>
                                <span className="font-bold">฿{(item.price * item.qty).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-300">
                        <span className="text-lg text-gray-600">ยอดชำระสุทธิ</span>
                        <span className="text-3xl font-bold text-orange-600">฿{totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;