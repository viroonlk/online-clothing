import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // โหลดข้อมูลตะกร้าจาก LocalStorage (ถ้ามี)
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // บันทึกลง LocalStorage ทุกครั้งที่ตะกร้าเปลี่ยน
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // ฟังก์ชันเพิ่มสินค้า
    const addToCart = (product) => {
        setCartItems(prev => {
            const isExist = prev.find(item => item.id === product.id);
            if (isExist) {
                // ถ้ามีแล้ว ให้บวกจำนวนเพิ่ม
                return prev.map(item => 
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
            return [...prev, { ...product, qty: 1 }];
        });
        alert('เพิ่มสินค้าลงตะกร้าแล้ว!');
    };

    // ฟังก์ชันลบสินค้า
    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // ล้างตะกร้า
    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};