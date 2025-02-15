import Task from '../models/Task.js';
import Project from '../models/Projects.js';


// Get all tasks
export const getAllTasks = async (req, res) => {
    try{
        // Using populate is necessary as organizationId is not stored in task, but it is in the associated project
        const tasks = await Task.find().populate({
            path: 'project',
            match: { organization: req.user.organizationId } 
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
};

// Get a task by id
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }

        const project = await Project.findById(task.project);
        if (!project || project.organization.toString() !== req.user.organizationId) {
            return res.status(403).json({ message: 'Unauthorized access to this task, as it is outside of your organization' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a task
export const createTask = async (req, res) => {
    try {
        const { projectId, title, description, status } = req.body; // TODO need to tell front end boys to include this
        const project = await Project.findById(projectId);

        if (!project || project.organization.toString() !== req.user.organizationId) {
            return res.status(403).json({ message: 'Unauthorized to create a task for this project, as it is outside of your organization' });
        }

        const newTask = await Task.create({
            title,
            description,
            status,
            project: projectId, 
            organization: req.user.organizationId 
    });
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error(error);
        return null;
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const project = await Project.findById(task.project);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        if (!project || project.organization.toString() !== req.user.organizationId) {
            return res.status(403).json({ message: 'Unauthorized to update this task' });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a task from the project
export const deleteTask = async (projectId, taskId) => {
    try {
        const task = await Task.findById(req.params.id);
        const project = await Project.findById(task.project);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (!project || project.organization.toString() !== req.user.organizationId) {
            return res.status(403).json({ message: 'Unauthorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
