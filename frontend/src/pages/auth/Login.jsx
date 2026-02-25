import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // เรียกใช้ฟังก์ชัน login
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            // 🔥 ดึง Role ออกมาดู
            const role = result.user?.role;
            
            // แสดง Alert เช็คค่า (ถ้าโค้ดใหม่ทำงาน ต้องขึ้นข้อความนี้!)
            alert(`Debug: Role ของคุณคือ [ ${role} ]`);

            // แยกทางตาม Role
            if (role === 'seller') {
                navigate('/seller/dashboard');
            } else if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/'); // ลูกค้าทั่วไป
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
                
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="w-full border p-2 rounded mt-1"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="w-full border p-2 rounded mt-1"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;