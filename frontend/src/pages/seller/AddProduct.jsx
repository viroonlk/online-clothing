import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const AddProduct = () => {
    const navigate = useNavigate();
    
    // 1. State สำหรับเก็บข้อมูลแบบ Text
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_qty: ''
    });

    // 2. State สำหรับเก็บ "ไฟล์รูปภาพ" และ "URL สำหรับพรีวิว"
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ฟังก์ชันจัดการเมื่อพิมพ์ข้อความ
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ฟังก์ชันจัดการเมื่อเลือกไฟล์รูปภาพ
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // สร้าง URL ชั่วคราวเพื่อให้โชว์รูปพรีวิวได้ทันที
            setPreview(URL.createObjectURL(file));
        }
    };

    // ฟังก์ชันส่งข้อมูลไปให้ Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 🔥 สร้างกล่องพัสดุ FormData
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('stock_qty', formData.stock_qty);
            if (formData.description) data.append('description', formData.description);
            
            // ถ้าร้านค้าเลือกรูปมาด้วย ก็จับใส่กล่องไปในชื่อ 'image'
            if (imageFile) {
                data.append('image', imageFile);
            }

            // ส่งข้อมูลไปที่ API แบบ multipart/form-data
            await api.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('✅ เพิ่มสินค้าและอัปโหลดรูปภาพสำเร็จ!');
            navigate('/seller/dashboard'); // เสร็จแล้วเด้งกลับไปหน้า Dashboard

        } catch (error) {
            console.error("Add Product Error:", error);
            alert('❌ เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถเพิ่มสินค้าได้'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-2">
                <Link to="/seller/dashboard" className="text-gray-400 hover:text-orange-500 transition text-2xl">
                    ⬅️
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">➕ เพิ่มสินค้าใหม่</h1>
            </div>

            {/* ฟอร์มเพิ่มสินค้า */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    
                    {/* ข้อมูลพื้นฐาน */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อสินค้า <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="เช่น เสื้อยืดลายทาง" 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl outline-none focus:border-orange-500 transition" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">รายละเอียดสินค้า</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            placeholder="อธิบายจุดเด่นของสินค้า..." 
                            rows="3"
                            className="w-full border-2 border-gray-200 p-3 rounded-xl outline-none focus:border-orange-500 transition" 
                        />
                    </div>

                    <div className="flex gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">ราคา (บาท) <span className="text-red-500">*</span></label>
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleChange} 
                                placeholder="0" 
                                min="0"
                                className="w-full border-2 border-gray-200 p-3 rounded-xl outline-none focus:border-orange-500 transition" 
                                required 
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">จำนวนสต็อก <span className="text-red-500">*</span></label>
                            <input 
                                type="number" 
                                name="stock_qty" 
                                value={formData.stock_qty} 
                                onChange={handleChange} 
                                placeholder="0" 
                                min="0"
                                className="w-full border-2 border-gray-200 p-3 rounded-xl outline-none focus:border-orange-500 transition" 
                                required 
                            />
                        </div>
                    </div>

                    {/* 🔥 โซนอัปโหลดรูปภาพพร้อม Preview */}
                    <div className="bg-orange-50 p-6 rounded-2xl border-2 border-dashed border-orange-200 mt-2">
                        <label className="block text-sm font-bold text-gray-800 mb-3">รูปภาพสินค้า (อัปโหลดจากเครื่อง)</label>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* กล่อง Preview */}
                            <div className="w-32 h-32 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-gray-300">📸</span>
                                )}
                            </div>
                            
                            {/* ปุ่มเลือกไฟล์ */}
                            <div className="flex-1 w-full">
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/webp" 
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-600 
                                    file:mr-4 file:py-3 file:px-6 
                                    file:rounded-full file:border-0 
                                    file:text-sm file:font-bold 
                                    file:bg-orange-500 file:text-white 
                                    hover:file:bg-orange-600 transition outline-none cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-2 ml-1">รองรับไฟล์ JPG, PNG, WEBP ขนาดไม่เกิน 5MB</p>
                            </div>
                        </div>
                    </div>

                    {/* ปุ่ม Submit */}
                    <div className="mt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`w-full font-bold py-4 rounded-xl shadow-md transition text-lg
                                ${isSubmitting 
                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                    : 'bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-1'
                                }`}
                        >
                            {isSubmitting ? 'กำลังบันทึกข้อมูล... ⏳' : '✅ บันทึกสินค้าใหม่'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;