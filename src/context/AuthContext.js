import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);

    useEffect(() => {
        const handleStorageChange = () => {
            setUserId(localStorage.getItem("user_id")); // Update user state if localStorage changes
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = (id) => {
        localStorage.setItem("user_id", id);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem("user_id");
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
