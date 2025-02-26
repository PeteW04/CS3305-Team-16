import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user } = useAuth(); // Access user state from AuthContext

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
