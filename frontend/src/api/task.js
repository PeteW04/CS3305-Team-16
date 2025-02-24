import { getAuthToken } from "../utils/token.js";

const API_URL = "http://localhost:5000/task";

export const changeTaskStatus = async (taskId, newStatus) => {
    try {
    // Send API request update the tasks status
    const response = await fetch(`http://localhost:5000/task/status/${taskId}`, {
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
        console.error("Error fetching projects:", error.message);
        throw error;
    }
}