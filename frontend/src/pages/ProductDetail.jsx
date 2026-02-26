import { useEffect, useState, useContext } from 'react'; // 🔥 1. เพิ่ม useContext
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext'; // 🔥 2. Import CartContext

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 3. ดึงฟังก์ชัน addToCart มาจาก Context
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="p-10 text-center text-xl font-bold">กำลังโหลดข้อมูลสินค้า...</div>;
    if (!product) return <div className="p-10 text-center text-red-500">ไม่พบสินค้าที่คุณต้องการ</div>;

    return (
        <div className="container mx-auto p-8 max-w-5xl">
            <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-orange-600 flex items-center gap-2">
                ← กลับหน้าหลัก
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                {/* ฝั่งรูปภาพ */}
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <img 
                        src={product.image_url || "https://via.placeholder.com/400"} 
                        alt={product.name} 
                        className="max-w-full max-h-full object-contain"
                    />
                </div>

                {/* ฝั่งข้อมูลสินค้า */}
                <div className="flex flex-col">
                    <p className="text-orange-500 font-medium mb-2 uppercase tracking-widest text-sm">ร้านค้า: {product.shop_name}</p>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                    <p className="text-3xl font-bold text-orange-600 mb-6">฿{product.price.toLocaleString()}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-xl mb-6 flex-grow">
                        <h3 className="font-bold text-gray-700 mb-2">รายละเอียดสินค้า</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                    </div>

                    <div className="mt-auto pt-4">
                        <p className="text-sm text-gray-400 mb-4">คงเหลือในสต็อก: {product.stock_qty} ชิ้น</p>
                        <div className="flex gap-4">
                            {/* 🔥 4. ใส่เหตุการณ์ onClick ให้เรียกฟังก์ชัน addToCart */}
                            <button 
                                onClick={() => addToCart(product)} 
                                className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-200"
                            >
                                เพิ่มลงตะกร้า
                            </button>
                            <button className="bg-orange-50 text-orange-600 px-6 py-4 rounded-xl font-bold hover:bg-orange-100 transition">
                                ❤️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;