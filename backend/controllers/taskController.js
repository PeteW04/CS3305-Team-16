import Task from '../models/Task.js';
import Project from '../models/Projects.js';


// Get all tasks
export const getAllTasks = async (req, res) => {
    try{
        const tasks = await Task.find({});
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get a task by id
export const getTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404).json({error: 'Task not found'});
    }
}

// Create a task
export const createTask = async (projectId, task) => {
    try {
        const newTask = await Task.create(task);
        const updatedProject = await Project.findByIdAndUpdate(
            projectId, 
            { $addToSet: { tasks: newTask._id } },
            { new: true }
        );

        if (!updatedProject) {
            throw new Error('Failed to update project with new task');
        }

        return updatedProject;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

// Delete a task from the project
export const deleteTask = async (projectId, taskId) => {
    try {
        // Delete the task from the Task collection
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            throw new Error('Task not found');
        }

        // Remove the task from the project's tasks array
        const updatedProject = await Project.findByIdAndUpdate(
            projectId, 
            { $pull: { tasks: taskId } },
            { new: true }
        );

        if (!updatedProject) {
            throw new Error('Failed to update project after task removal');
        }

        return updatedProject;
    } catch (error) {
        console.error(error);
        return null;  // Return null if there was an error
    }
};
