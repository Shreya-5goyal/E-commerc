import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);

    const fetchWishlist = useCallback(async () => {
        if (!user) { setWishlist([]); return; }
        try {
            const res = await api.get('/users/wishlist');
            setWishlist(res.data || []);
        } catch {
            setWishlist([]);
        }
    }, [user]);

    useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

    const addToWishlist = async (productId) => {
        try {
            await api.post(`/users/wishlist/${productId}`);
            await fetchWishlist();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed' };
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete(`/users/wishlist/${productId}`);
            await fetchWishlist();
            return { success: true };
        } catch {
            return { success: false };
        }
    };

    const isWishlisted = (productId) =>
        wishlist.some(p => p.productId === productId);

    return (
        <WishlistContext.Provider value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
