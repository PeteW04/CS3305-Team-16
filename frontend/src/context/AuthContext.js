import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user information
    const [token, setToken] = useState(localStorage.getItem("authToken") || ""); // Get token from localStorage
    const navigate = useNavigate();

    const login = async (data) => {
        try {
            const response = await fetch("https://api.example.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                setUser(result.user);
                setToken(result.token);
                localStorage.setItem("authToken", result.token); 
                navigate("/dashboard"); 
            } else {
                alert(result.message); 
            }
        } catch (err) {
            console.error("Login Error:", err.message);
        }
    };

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            fetch("http://localhost:5000/validate", {
                headers: { Authorization: `Bearer ${storedToken}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        setUser(data.user);
                        setToken(storedToken);
                    } else {
                        logout();
                    }
                })
                .catch(() => logout()); 
        }
    }, []); 

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
