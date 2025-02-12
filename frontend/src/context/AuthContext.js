import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, validateTokenAPI } from "../api/auth"; // Import API functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user information
    const [token, setToken] = useState(localStorage.getItem("authToken") || ""); // Get token from localStorage
    const navigate = useNavigate();

    // Login function
    const login = async (data) => {
        try {
            const result = await loginAPI(data);
            setUser(result.user);
            setToken(result.token);
            localStorage.setItem("authToken", result.token);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            validateTokenAPI(storedToken)
                .then((userData) => {
                    setUser(userData);
                    setToken(storedToken);
                })
                .catch(() => logout()); // Log out if token is invalid or expired
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
