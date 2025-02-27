import Task from '../models/Task.js';
import Project from '../models/Projects.js';


// Get all tasks
export const getAllTasks = async (req, res) => {
    try {
        // Using populate is necessary as organizationId is not stored in task, but it is in the associated project
        const tasks = await Task.find().populate({
            path: 'project',
            match: { organization: req.user.organizationId }
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get a task by id
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
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

export const getTasksByUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const usersTasks = await Task.find({ user: userId });
        return res.status(200).json(usersTasks);
    } catch (e) {
        console.error("Error in getTaskByUser: ", e.message);
        return res.status(500).json({ error: e.message });
    }
}

// Create a task
export const createTask = async (projectId, task, userId, priority) => {
    try {
        const newTask = await Task.create({
            title: task.title,
            project: projectId,
            description: task.description,
            user: userId,
            priority
        });
        return newTask;
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

        //if (!project || project.organization.toString() !== req.user.organizationId) {
        //return res.status(403).json({ message: 'Unauthorized to update this task' });
        //}

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a tasks status
export const updateTaskStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;
        const task = await Task.findById(id);
        const validStatuses = ["todo", "progress", "done"];

        if (!validStatuses.includes(status)) {
            return res.status(404).json({ error: 'Invalid Status' });
        }

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.status = status;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a task from the project
export const deleteTask = async () => {
    try {
        // Delete the task from the database
        await Task.findByIdAndDelete(req.params.id);

        return { message: 'Task deleted successfully' }
    } catch (error) {
        return { error: error.message }
    }
};
