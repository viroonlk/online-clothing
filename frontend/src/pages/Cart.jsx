import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom'; // 🔥 1. เพิ่ม useNavigate
import api from '../api/axios'; // 🔥 2. Import API สำหรับยิงข้อมูลไป Backend

const Cart = () => {
    const { cartItems, removeFromCart, clearCart, increaseQty, decreaseQty } = useContext(CartContext);
    const navigate = useNavigate(); // สำหรับเปลี่ยนหน้า

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // 🔥 3. สร้างฟังก์ชันจัดการการสั่งซื้อ
    const handleCheckout = async () => {
        // ให้ลูกค้ากรอกที่อยู่แบบง่ายๆ (Pop-up)
        const address = prompt("📍 กรุณากรอกที่อยู่สำหรับจัดส่งสินค้า:");

        // ถ้าลูกค้ากดยกเลิก
        if (address === null) return;

        // ถ้าไม่พิมพ์อะไรเลยแล้วกดตกลง
        if (address.trim() === '') {
            alert("⚠️ กรุณากรอกที่อยู่จัดส่งเพื่อดำเนินการต่อ");
            return;
        }

        try {
            // เตรียมข้อมูลส่งไป Backend (ชื่อ Key ต้องตรงกับที่ Backend รับ)
            const payload = {
                cartItems: cartItems,
                totalAmount: totalPrice,
                shippingAddress: address
            };

            // ยิง API สร้างคำสั่งซื้อ
            const res = await api.post('/orders', payload);

            // แจ้งเตือนเมื่อสำเร็จ
            alert(`🎉 สั่งซื้อสำเร็จ! รหัสคำสั่งซื้อของคุณคือ: #${res.data.order_id}`);

            // ล้างตะกร้าให้ว่างเปล่า
            clearCart();

            // พากลับไปหน้าแรก
            navigate('/');

        } catch (error) {
            console.error("Checkout Error:", error);
            // แจ้งเตือนถ้าเกิด Error (เช่น Token หมดอายุ หรือยังไม่ได้ Login)
            alert('❌ เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'กรุณาล็อกอินก่อนทำการสั่งซื้อ'));
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto p-10 text-center mt-10 bg-white rounded-xl shadow-sm border max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">🛒 ตะกร้าของคุณยังว่างอยู่</h2>
                <p className="text-gray-500 mb-6">ลองหาดูสินค้าที่น่าสนใจแล้วเพิ่มลงตะกร้าดูสิ!</p>
                <Link to="/" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition">
                    กลับไปช้อปปิ้ง
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">🛒 ตะกร้าสินค้าของคุณ</h1>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex flex-col gap-6">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center gap-6">
                                <img
                                    src={item.image_url || "https://via.placeholder.com/150"}
                                    alt={item.name}
                                    className="w-24 h-24 object-contain bg-gray-50 rounded-lg border p-2"
                                />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">ร้าน: {item.shop_name}</p>
                                    <p className="text-orange-600 font-bold mt-1">฿{item.price}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 transition font-bold text-lg cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1.5 font-bold text-gray-800 bg-white w-12 text-center border-x">
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 transition font-bold text-lg cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>

                                <span className="font-bold text-xl text-gray-800 min-w-[80px] text-right">
                                    ฿{(item.price * item.qty).toLocaleString()}
                                </span>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 font-medium bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition"
                                >
                                    ลบออก
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t flex flex-col items-end gap-4 bg-gray-50 p-6 rounded-xl">
                    <div className="flex justify-between w-full max-w-sm">
                        <span className="text-gray-600 text-lg">ยอดรวมทั้งหมด:</span>
                        <span className="text-3xl font-bold text-orange-600">฿{totalPrice.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-4 w-full max-w-sm mt-4">
                        <button
                            onClick={clearCart}
                            className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                        >
                            ล้างตะกร้า
                        </button>
                        {/* 🔥 4. ใส่ onClick ให้ปุ่มชำระเงิน */}
                        <button
                            onClick={() => navigate('/checkout')}
                            className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-md"
                        >
                            ดำเนินการชำระเงิน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;