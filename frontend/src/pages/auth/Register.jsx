import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer' // ค่าเริ่มต้น
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }

        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            alert('สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || "การสมัครล้มเหลว");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">สมัครสมาชิก</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full border p-2 mb-2 rounded" required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 mb-2 rounded" required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 mb-2 rounded" required />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full border p-2 mb-2 rounded" required />
                    
                    <select name="role" onChange={handleChange} className="w-full border p-2 mb-4 rounded">
                        <option value="customer">ลูกค้า (Customer)</option>
                        <option value="seller">คนขาย (Seller)</option>
                    </select>

                    <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
                </form>
                <p className="mt-4 text-center text-sm">
                    มีบัญชีแล้ว? <a href="/login" className="text-blue-500">เข้าสู่ระบบ</a>
                </p>
            </div>
        </div>
    );
}

export default Register;