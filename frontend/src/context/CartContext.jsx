import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const isExist = prev.find(item => item.id === product.id);
            if (isExist) {
                return prev.map(item => 
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
        alert('🛒 เพิ่มสินค้าลงตะกร้าแล้ว!');
    };

    const increaseQty = (id) => {
        setCartItems(prev => prev.map(item => 
            item.id === id ? { ...item, qty: item.qty + 1 } : item
        ));
    };

    const decreaseQty = (id) => {
        setCartItems(prev => prev.map(item => 
            item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
        ));
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, clearCart, increaseQty, decreaseQty 
        }}>
            {children}
        </CartContext.Provider>
    );
};