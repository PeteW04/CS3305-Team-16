import { getAuthToken } from "../utils/token.js";

const API_URL = "http://localhost:5000/message";

export const sendMessage = async (messageData) => {
    try {
        const response = await fetch(`${API_URL}/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
            },
            body: JSON.stringify(messageData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to send message");
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending message:", error.message);
        throw error;
    }
};

export const editMessage = async (messageId, text) => {
    try {
        const response = await fetch(`${API_URL}/edit/${messageId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`, // Attach JWT token
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to edit message");
        }

        const updatedMessage = await response.json();
        return updatedMessage;
    } catch (error) {
        console.error("Error editing message:", error.message);
        throw error;
    }
};

export const deleteMessage = async (messageId) => {
    try {
        const response = await fetch(`${API_URL}/delete/${messageId}`, {
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

        return { messageId };
    } catch (error) {
        console.error("Error deleting message:", error.message);
        throw error;
    }
};

export const markMessagesRead = async (channelId) => {
    try {
        const res = await fetch(`/mark-read/${channelId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}`, }
        });
        return await res.json();
    } catch (error) {
        console.error('Error marking message read:', error);
        return null;
    }
};
