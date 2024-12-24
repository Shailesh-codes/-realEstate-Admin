import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from "../hooks/useApi";



interface AuthContextType {
    user: {
        name: string;
        email: string;
        role: string;
        id: string;
    } | null;
    setUser: (user: any) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => { }, isAuthenticated: false, logout: () => { }, });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const isAuthenticated = Boolean(user);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            // Set axios default header
            axios.defaults.withCredentials = true;
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const logout = async () => {
        try {
            await axios.post(`${api}/auth/logout`);
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);