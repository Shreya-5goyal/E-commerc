import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const response = await api.get('/auth/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (credentials) => {
        try {
            await api.post('/auth/signin', credentials);
            await checkUser();
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (data) => {
        try {
            await api.post('/auth/signup', data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/signout');
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    // Role helpers
    const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;
    const isSeller = user?.roles?.includes('ROLE_SELLER') ?? false;

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin, isSeller }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
