import { useState, useEffect } from 'react';
import api from '../api/axios'; // หรือพาธที่คุณใช้เรียก axios
import { Link } from 'react-router-dom';

const Home = () => {
    // 1. สร้าง State เก็บข้อมูล
    const [products, setProducts] = useState([]); // เก็บสินค้าทั้งหมดจาก Database
    const [filteredProducts, setFilteredProducts] = useState([]); // เก็บสินค้าที่ผ่านการกรองแล้ว
    const [searchTerm, setSearchTerm] = useState(''); // เก็บคำค้นหาที่ลูกค้าพิมพ์
    const [loading, setLoading] = useState(true);

    // 2. ดึงข้อมูลสินค้าทั้งหมดตอนเปิดหน้าเว็บ
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
                setFilteredProducts(res.data); // เริ่มต้นให้โชว์สินค้าทั้งหมดก่อน
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // 3. ฟังก์ชันกรองสินค้า (จะทำงานอัตโนมัติทุกครั้งที่ searchTerm เปลี่ยน)
    useEffect(() => {
        const results = products.filter(product =>
            // ค้นหาจากชื่อสินค้า (ทำให้เป็นตัวเล็กทั้งหมดก่อนเพื่อจะได้ค้นหาเจอชัวร์ๆ)
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // หรือค้นหาจากชื่อร้านค้า
            (product.shop_name && product.shop_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);

    if (loading) return <div className="text-center mt-20 text-2xl font-bold text-gray-600">กำลังโหลดสินค้าทั้งหมด... ⏳</div>;

    return (
        <div className="container mx-auto p-8 max-w-7xl">
            {/* Header & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-orange-50 p-6 rounded-2xl border border-orange-100">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800">🛍️ สินค้ามาใหม่</h1>
                    <p className="text-gray-500 mt-2">เลือกช้อปสินค้าคุณภาพจากหลากหลายร้านค้า</p>
                </div>
                
                {/* 🔍 ช่องค้นหา */}
                <div className="w-full md:w-96 relative">
                    <input 
                        type="text" 
                        placeholder="ค้นหาชื่อเสื้อผ้า, ชื่อร้านค้า..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-2 border-orange-300 rounded-full py-3 px-5 pl-12 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition shadow-sm text-gray-700 font-medium"
                    />
                    <span className="absolute left-4 top-3.5 text-xl">🔍</span>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center bg-gray-50 p-16 rounded-3xl border-2 border-dashed border-gray-200 mt-10">
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-2xl font-bold text-gray-700">ไม่พบสินค้าที่คุณค้นหา</h2>
                    <p className="text-gray-500 mt-2">ลองใช้คำค้นหาอื่นดูสิครับ</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col group">
                            {/* รูปสินค้า */}
                            <div className="relative overflow-hidden aspect-square bg-gray-50">
                                <img 
                                    src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                                {product.stock_qty <= 0 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm transform -rotate-12">สินค้าหมด!</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* รายละเอียดสินค้า */}
                            <div className="p-5 flex flex-col flex-1">
                                <p className="text-xs font-bold text-orange-500 mb-1 uppercase tracking-wider">🏪 {product.shop_name || 'ร้านค้าทั่วไป'}</p>
                                <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2 leading-tight">{product.name}</h3>
                                
                                <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                                    <span className="text-2xl font-extrabold text-gray-800">฿{Number(product.price).toLocaleString()}</span>
                                    
                                    {/* ปุ่มกดดูรายละเอียด */}
                                    <Link 
                                        to={`/product/${product.id}`} 
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                                            product.stock_qty > 0 
                                            ? 'bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                                        }`}
                                    >
                                        {product.stock_qty > 0 ? 'หยิบลงตะกร้า' : 'สินค้าหมด'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;