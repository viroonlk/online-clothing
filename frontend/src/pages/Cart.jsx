import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cartItems.length === 0) return (
        <div className="p-20 text-center">
            <h2 className="text-2xl mb-4">ตะกร้าของคุณยังว่างอยู่ 🛒</h2>
            <Link to="/" className="text-orange-500 underline">ไปช้อปปิ้งกันเลย!</Link>
        </div>
    );

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">ตะกร้าสินค้าของคุณ</h1>
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-0">
                        <div className="flex items-center gap-4">
                            <img src={item.image_url} className="w-20 h-20 object-contain bg-gray-50 rounded" />
                            <div>
                                <h3 className="font-bold">{item.name}</h3>
                                <p className="text-gray-500 text-sm">฿{item.price} x {item.qty}</p>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline">ลบออก</button>
                    </div>
                ))}
                
                <div className="mt-8 border-t pt-6 flex justify-between items-center">
                    <div>
                        <p className="text-gray-500">ราคารวมทั้งหมด</p>
                        <p className="text-3xl font-bold text-orange-600">฿{total.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={clearCart} className="text-gray-400">ล้างตะกร้า</button>
                        <button className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition">
                            สั่งซื้อสินค้า
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;