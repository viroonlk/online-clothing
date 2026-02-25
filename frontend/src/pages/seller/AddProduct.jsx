import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_qty: '',
        image_url: '' // เดี๋ยวเราจะใช้วิธีแปะลิ้งค์รูปไปก่อน (ยังไม่อัพโหลดไฟล์จริง)
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            alert('เพิ่มสินค้าสำเร็จ!');
            navigate('/seller/dashboard'); // กลับไปหน้า Dashboard
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-10 bg-gray-50 min-h-screen flex justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-700">📦 เพิ่มสินค้าใหม่</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">ชื่อสินค้า</label>
                        <input type="text" name="name" onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">รายละเอียด</label>
                        <textarea name="description" rows="3" onChange={handleChange} className="w-full border p-2 rounded"></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-1">ราคา (บาท)</label>
                            <input type="number" name="price" onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">จำนวนสต็อก</label>
                            <input type="number" name="stock_qty" onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-1">ลิงค์รูปภาพ (URL)</label>
                        <input type="text" name="image_url" placeholder="https://example.com/image.jpg" onChange={handleChange} className="w-full border p-2 rounded" />
                        <p className="text-xs text-gray-500 mt-1">*ใส่ลิ้งค์รูปจากเว็บอื่นไปก่อน</p>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700">บันทึกสินค้า</button>
                        <button type="button" onClick={() => navigate('/seller/dashboard')} className="flex-1 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400">ยกเลิก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;