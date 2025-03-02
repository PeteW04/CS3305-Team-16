import { getAuthToken } from "../utils/token.js";

const API_URL = "http://localhost:5000/notifications";

export const getNotifications = async () => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch channels");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching channels:", error.message);
        throw error;
    }
};


export const deleteNotification = async (notificationId) => {
    try {
        const response = await fetch(`${API_URL}/${notificationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete message");
        }

        return { success: true, notificationId };
    } catch (error) {
        console.error("Error deleting message:", error.message);
        throw error;
    }
};

