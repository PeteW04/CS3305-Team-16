import { getAuthToken } from "../utils/token.js";

const API_URL = "http://localhost:5000/project";

export const getProjects = async () => {
    try {
    // Send API request to get all projects, with the users token
    const response = await fetch("http://localhost:5000/project", {
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
    const response = await fetch(`http://localhost:5000/project/${projectId}/tasks`, {
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

export const addTask = async (projectId, taskData) => {
    // Send API request to add a new task
    try {
    const response = await fetch(`http://localhost:5000/project/projectId/${projectId}/tasks/add`, {
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