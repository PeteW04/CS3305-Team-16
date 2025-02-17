import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, validateTokenAPI } from "../api/auth"; // Import API functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user information
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Get token from localStorage
    const navigate = useNavigate();

    const login = async (data) => {
        try {
            const result = await loginAPI(data);
            setUser(result.user);
            setToken(result.token);
            localStorage.setItem("token", result.token);
            navigate("/tasks");
        } catch (error) {
            alert(error.message);
        }
    };

    const logout = useCallback(() => {
        setUser(null);
        setToken("");
        localStorage.removeItem("authToken");
        navigate("/login");
    }, [navigate]);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            validateTokenAPI(storedToken)
                .then((userData) => {
                    setUser(userData);
                    setToken(storedToken);
                })
                .catch(() => logout());
        }
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
