import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, validateTokenAPI } from "../api/auth"; // Import API functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
        const validateAuth = async () => {
            const storedToken = localStorage.getItem("authToken");
            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await validateTokenAPI(storedToken);
                setUser(userData);
                setToken(storedToken);
            } catch (error) {
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        validateAuth();
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
