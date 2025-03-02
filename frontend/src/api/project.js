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

export const updatingProject = async (projectId, data) => {
    try {
        console.log('updatingProject Project');
        console.log(projectId, data);
        const response = await fetch(`${API_URL}/${projectId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to update project");
        }
        
        console.log('Response: ', response);
        return await response.json();

    } catch (error) {
        console.error("Error updating project:", error.message);
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
                status: 'todo',
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


export const addEmployeeToProject = async (projectId, employeeId) => {
    try {
        const response = await fetch(`${API_URL}/employees/add`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId,
                employeeId
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
    } catch (error) {
        console.error("Error deleting task:", error.message);
        throw error;
    }
}


export const deletingProject = async (projectId) => {
    try {
        const response = await fetch(`${API_URL}/${projectId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) throw new Error('Failed to delete project');

        // Return the response 
        return await response.json();
    } catch (error) {
        console.error("Error deleting project:", error.message);
        throw error;
    }
}
