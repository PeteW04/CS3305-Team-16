import { getAuthToken } from "../utils/token.js";

const API_URL = "http://localhost:5000/user";


export const changePassword = async (data) => {
    try {
        const response = await fetch(`${API_URL}/change-password`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getAuthToken()}` },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Change Password failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in changePassword:", error.message);
        throw error;
    }
};
