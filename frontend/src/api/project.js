import { getAuthToken } from "../utils/token.js";

const API_URL = "http://localhost:5000/project";

export const getProjects = async () => {
    try {
    // Send API request to get all projects, with the users token
    const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
    });
    
    // Ensure the response comes back ok
    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    // Return the response 
    return await response.json();

    // Catch any errors
    } catch (error) {
        console.error("Error fetching projects:", error.message);
        throw error;
    }
}

export const getProject = async (projectId) => {
    try {
    // Send API request to get all projects, with the users token
    const response = await fetch(`${API_URL}/projectId/${projectId}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
    });
    
    // Ensure the response comes back ok
    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    // Return the response 
    return await response.json();

    // Catch any errors
    } catch (error) {
        console.error("Error fetching projects:", error.message);
        throw error;
    }
}

export const getProjectTasks = async (projectId) => {
    try {
    const response = await fetch(`${API_URL}/${projectId}/tasks`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
        });

    if (!response.ok) {
        throw new Error("Failed to fetch project tasks");
    }

    return await response.json();

    } catch (error) {
        console.error("Error fetching projects:", error.message);
        throw error;
    }
}

export const addTaskToProject = async (projectId, taskData) => {
    // Send API request to add a new task
    try {
        console.log("addTaskToProject taskData: ", taskData);
        const response = await fetch(`${API_URL}/projectId/${projectId}/tasks/add`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                ...taskData, 
                status: 'New', 
            })
        });
        
        if (!response.ok) throw new Error('Failed to create task');

        // Return the response 
        return await response.json();

    // Catch any errors
    } catch (error) {
        console.error("Error fetching projects:", error.message);
        throw error;
    }
}

export const deleteTaskFromProject = async (projectId, taskId) => {
    try {
        console.log('deleteTaskFromProject projectId: ', projectId);
        console.log('deleteTaskFromProject taskId: ', taskId);

        const response = await fetch(`${API_URL}/projectId/${projectId}/tasks/remove/taskId/${taskId}`, {
            method: 'DELETE',
            headers: { 
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json' 
            },
        });

        if (!response.ok) throw new Error('Failed to delete task');

        // Return the response 
        return await response.json();
    }  catch (error) {
        console.error("Error deleting task:", error.message);
        throw error;
    }
}