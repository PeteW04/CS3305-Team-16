import { getAuthToken } from "../utils/token";
const API_URL = "http://localhost:5000";

export const getUsersInOrganization = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch users");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error.message);
        throw error;
    }
};