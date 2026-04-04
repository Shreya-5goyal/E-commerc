import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/carts/users/cart');
            setCart(response.data);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const addToCart = async (productId, quantity) => {
        try {
            await api.post(`/carts/products/${productId}/quantity/${quantity}`);
            await fetchCart();
            return { success: true };
        } catch (err) {
            console.error("Error adding to cart:", err);
            return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
        }
    };

    const updateQuantity = async (productId, operation) => {
        try {
            const response = await api.put(`/cart/products/${productId}/quantity/${operation}`);
            setCart(response.data);
            return { success: true };
        } catch (err) {
            console.error("Error updating quantity:", err);
            return { success: false };
        }
    };

    const removeFromCart = async (cartId, productId) => {
        try {
            await api.delete(`/carts/${cartId}/product/${productId}`);
            await fetchCart();
            return { success: true };
        } catch (err) {
            console.error("Error removing from cart:", err);
            return { success: false };
        }
    };

    const clearCart = () => {
        setCart(null);
    };

    return (
        <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
