import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const setAuthData = ({ user: userData, accessToken, refreshToken }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        return setAuthData(data.data);
    };

    // Step 1: Send OTP (does NOT create account)
    const initiateRegister = async (formData) => {
        const { data } = await api.post('/auth/register', formData);
        return data;
    };

    // Step 2: Verify OTP → creates account → logs in
    const verifyOtp = async (email, otp) => {
        const { data } = await api.post('/auth/verify-otp', { email, otp });
        return setAuthData(data.data);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch { /* ignore */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = { user, loading, login, initiateRegister, verifyOtp, setAuthData, logout, isAuthenticated: !!user };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
