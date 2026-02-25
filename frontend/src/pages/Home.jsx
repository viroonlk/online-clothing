import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom'; // 🔥 เพิ่ม Link เข้ามาตรงนี้

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // เรียก API ดึงสินค้าทั้งหมด
                const res = await api.get('/products'); 
                setProducts(res.data);
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="p-10 text-center text-xl">กำลังโหลดสินค้า...</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">สินค้าทั้งหมด 🔥</h1>
                <p className="text-gray-500">พบสินค้า {products.length} รายการ</p>
            </div>
            
            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">ยังไม่มีสินค้าวางขายในขณะนี้</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        /* 🔥 หุ้มทั้งการ์ดด้วย Link เพื่อให้คลิกตรงไหนก็ได้เพื่อดูรายละเอียด */
                        <Link 
                            key={product.id} 
                            to={`/product/${product.id}`} 
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group"
                        >
                            {/* กรอบรูปจัตุรัสแบบสมส่วน */}
                            <div className="aspect-square bg-gray-50 flex items-center justify-center p-2 overflow-hidden">
                                <img 
                                    src={product.image_url || "https://via.placeholder.com/150"} 
                                    alt={product.name} 
                                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate" title={product.name}>
                                    {product.name}
                                </h3>
                                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                                    ร้าน: {product.shop_name}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 italic">
                                    {product.description}
                                </p>
                                
                                <div className="mt-auto flex justify-between items-center">
                                    <span className="text-orange-600 font-bold text-xl">฿{product.price}</span>
                                    {/* เปลี่ยนจาก button เป็น span หรือ div เพราะซ้อน Link ไม่ได้ แต่ให้หน้าตาเหมือนเดิม */}
                                    <span className="bg-orange-500 text-white text-sm px-3 py-1.5 rounded-lg group-hover:bg-orange-600 transition-colors">
                                        ดูรายละเอียด
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;