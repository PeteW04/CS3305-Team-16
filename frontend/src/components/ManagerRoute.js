import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "./Spinner";

const ManagerRoute = () => {
    const { user, isLoading } = useAuth();
    const isManager = user && user.role === 'manager';

    if (isLoading) {
        return <Spinner />;
    }

    return isManager ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default ManagerRoute; 