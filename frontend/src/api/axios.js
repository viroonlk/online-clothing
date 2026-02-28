import axios from 'axios';

const api = axios.create({
    baseURL: 'https://online-clothing-bnij.onrender.com/api', // ชี้ไปที่ Backend ของเรา
    headers: {
        'Content-Type': 'application/json',
    },
});

// แถม: ตัวช่วยใส่ Token อัตโนมัติเวลาส่ง Request (Interceptors)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // ดึง Token จากเครื่อง
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;