import { getAuthToken } from "../utils/token.js";

const API_URL = "http://localhost:5000/task";


export const getTasksByUser = async () => {
    try {
        const response = await fetch(`${API_URL}/userTasks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch users Tasks");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching users Tasks:", error.message);
        throw error;
    }
};

export const getTasksByUserID = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/userTasksID/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch users Tasks");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching users Tasks:", error.message);
        throw error;
    }
};


export const changeTaskStatus = async (taskId, newStatus) => {
    try {
        // Send API request update the tasks status
        const response = await fetch(`${API_URL}/status/${taskId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update task status');
        }

        // Return the response 
        return await response.json();

        // Catch any errors
    } catch (error) {
        console.error("Error updating task status:", error.message);
        throw error;
    }
}

export const editTask = async (taskData) => {
    console.log('Edit Task taskData: ', taskData);
    try {
        // Send API request to add a new task
        const response = await fetch(`${API_URL}/${taskData._id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...taskData
            })
        });

        if (!response.ok) throw new Error('Failed to edit task');

        // Return the response 
        return await response.json();

        // Catch any errors
    } catch (error) {
        console.error("Error editing task:", error.message);
        throw error;
    }
}