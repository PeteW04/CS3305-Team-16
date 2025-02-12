const API_URL = "http://localhost:5000/auth";


export const registerManager = async (managerData) => {
    try {
        const response = await fetch(`${API_URL}/register-manager`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(managerData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to register manager");
        }

        return await response.json();
    } catch (error) {
        console.error("Error registering manager:", error.message);
        throw error;
    }
};


export const loginAPI = async (loginData) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to log in");
        }

        return await response.json();
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};


export const registerEmployee = async (employeeData) => {
    try {
        const response = await fetch(`${API_URL}/register-employee`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to register employee");
        }

        return await response.json();
    } catch (error) {
        console.error("Error registering employee:", error.message);
        throw error;
    }
};


export const validateTokenAPI = async (token) => {
    try {
        const response = await fetch(`${API_URL}/validate`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Token validation failed");
        }

        return await response.json(); // Returns user data
    } catch (error) {
        console.error("Error in validateToken:", error.message);
        throw error;
    }
};