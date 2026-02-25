import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // ฟังก์ชัน Login
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            // บันทึก Token
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);

            // 🔥 จุดสำคัญ: ต้องส่ง user กลับไปให้หน้า Login ใช้งาน
            return { success: true, user: user }; 
            
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    // ฟังก์ชัน Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        window.location.href = '/login'; // บังคับรีเฟรชกลับหน้า Login
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;