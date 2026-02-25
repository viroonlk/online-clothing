import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({ shop_name: '', description: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const shopRes = await api.get('/shops/me');
                setShop(shopRes.data);

                if (shopRes.data) {
                    const productRes = await api.get('/products/my-products');
                    setProducts(productRes.data);
                }
            } catch (error) {
                console.log("ยังไม่มีร้านค้า หรือเกิดข้อผิดพลาด");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateShop = async (e) => {
        e.preventDefault();
        try {
            await api.post('/shops', formData);
            alert('สร้างร้านค้าสำเร็จ!');
            window.location.reload();
        } catch (error) {
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("คุณแน่ใจไหมว่าจะลบสินค้านี้?")) return;
        
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            alert("ลบสินค้าเรียบร้อย");
        } catch (error) {
            alert("ลบไม่สำเร็จ");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">Logout</button>
            </div>

            {shop ? (
                <div>
                    <div className="bg-white p-6 rounded shadow mb-6 border-l-4 border-green-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-green-700">🏪 {shop.shop_name}</h2>
                                <p className="text-gray-600">{shop.description}</p>
                            </div>
                            <button 
                                onClick={() => navigate('/seller/add-product')}
                                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center gap-2"
                            >
                                + เพิ่มสินค้าใหม่
                            </button>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4">📦 รายการสินค้าของคุณ ({products.length})</h3>
                    
                    {products.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">ยังไม่มีสินค้า.. ลองกดเพิ่มดูสิ!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded shadow hover:shadow-lg transition p-0 overflow-hidden border">
                                    {/* 🔥🔥🔥 แก้ตรงนี้: ใช้ object-contain 🔥🔥🔥 */}
                                    <img 
                                        src={product.image_url || "https://via.placeholder.com/150"} 
                                        alt={product.name} 
                                        className="w-full aspect-square object-contain bg-gray-100 border-b"
                                    />
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg">{product.name}</h4>
                                        <p className="text-gray-500 text-sm h-10 overflow-hidden">{product.description}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-green-600 font-bold text-xl">฿{product.price}</span>
                                            <span className="text-gray-400 text-sm">สต็อก: {product.stock_qty}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="w-full mt-4 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200"
                                        >
                                            ลบสินค้า
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
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