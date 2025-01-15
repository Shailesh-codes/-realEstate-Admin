import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from "../hooks/api";



interface AuthContextType {
    user: {
        name: string;
        email: string;
        role: string;
        id: string;
        profilePhoto?: string;
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
            axios.defaults.withCredentials = true;
        } else {
            localStorage.removeItem('user');
            // Clear axios defaults when logged out
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [user]);

    const logout = async () => {
        try {
            await axios.post(`${api}/auth/logout`);
            setUser(null);
            localStorage.clear(); // Clear all localStorage items
            // Clear any cookies
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        } catch (error) {
            throw error; // Propagate error to handle in component
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);