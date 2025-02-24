import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, validateTokenAPI } from "../api/auth"; // Import API functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    console.log("AuthProvider rendered");
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null); // Stores user information
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Get token from localStorage
    const navigate = useNavigate();

    const login = async (data) => {
        try {
            const result = await loginAPI(data);
            setUser(result.user);
            setToken(result.token);
            localStorage.setItem("authToken", result.token);
            navigate("/tasks");
        } catch (error) {
            throw error; 
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
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setIsLoading(false); // Mark loading as complete
                });
        } else {
            setIsLoading(false); // No token, mark loading as complete
        }
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
