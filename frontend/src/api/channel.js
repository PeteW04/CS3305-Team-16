import { getAuthToken } from "../utils/token.js";

const API_URL = "http://localhost:5000/channel";

export const getChannels = async () => {
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

export const getMessages = async (channelId) => {
    try {
        const response = await fetch(`${API_URL}/messages/${channelId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch messages");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        throw error;
    }
};

export const createChannel = async (channelData) => {
    try {
        const response = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
            },
            body: JSON.stringify(channelData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create channel");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating channel:", error.message);
        throw error;
    }
};

export const editChannel = async (channelId, channelData) => {
    try {
        const response = await fetch(`${API_URL}/edit/${channelId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
            },
            body: JSON.stringify(channelData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to edit channel");
        }

        return await response.json();
    } catch (error) {
        console.error("Error editing channel:", error.message);
        throw error;
    }
};

export const deleteChannel = async (channelId) => {
    try {
        const response = await fetch(`${API_URL}/delete/${channelId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete channel");
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting channel:", error.message);
        throw error;
    }
};


export const markMessagesRead = async (channelId) => {
    try {
        const res = await fetch(`${API_URL}/mark-read/${channelId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}`, }
        });
        return await res.json();
    } catch (error) {
        console.error('Error marking message read:', error);
        return null;
    }
};