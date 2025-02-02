import Project from '../models/Projects.js';
import Task from '../models/Task.js';
import mongoose from 'mongoose';
import { createTask } from './taskController.js';

// GET: List all Projects
export const getAllProjects = async (req, res) => {
    try {
        // Get all projects and return them
        const projects = await Project.find({});
        res.status(200).json(projects);
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

// GET: List all Projects in an Organization
export const getAllProjectsByOrg = async (req, res) => {
    try {
        // Get all projects and return them
        const { org } = req.params;
        const projects = await Project.find({organization: org});
        res.status(200).json(projects);
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

// GET: Return a single Project based on its ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// POST: Create a new Project within an Organization 
export const createProject = async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// PUT: Change project name
export const changeTitle = async (req, res) => {
    try{
        const { projectId, title } = req.params;

        // Find the project and update its title
        const project = await Project.findByIdAndUpdate(
            projectId,
            { title: title },
            { new: true }
        );

        // Verify that the updated project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project title updated', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Change project description
export const changeDescription = async (req, res) => {
    try{
        const { projectId, description } = req.params;

        // Find the project and update its description
        const project = await Project.findByIdAndUpdate(
            projectId,
            { description: description },
            { new: true }
        );

        // Verify that the updated project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project title updated', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// PUT: Change project deadline
export const changeDeadline = async (req, res) => {
    try{
        const { projectId, deadline } = req.params;

        // Find the project and update its deadline
        const project = await Project.findByIdAndUpdate(
            projectId,
            { deadline: deadline },
            { new: true }
        );

        // Verify that the updated project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project title updated', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Add a worker to a project
export const addEmployee = async (req, res) => {
    try {
        const { employeeId, projectId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ error: 'Invalid projectId or employeeId' });
        }

        const project = await Project.findByIdAndUpdate(
            projectId, 
            { $addToSet: { employees: employeeId } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Employee added successfully', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Remove a worker from a project
export const removeEmployee = async (req, res) => {
    try {
        const { employeeId, projectId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ error: 'Invalid projectId or employeeId' });
        }

        const project = await Project.findByIdAndUpdate(
            projectId, 
            { $pull: { employees: employeeId } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Failed to remove employee' });
        }

        res.status(200).json({ message: 'Employee added successfully', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Add a new task to a project
export const addTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { task } = req.body;

        // Ensure a valid project id
        const project = await Project.findById(projectId);
        if (!project){
            return res.status(404).json({ error: 'Project not found' });
        }

        // Ensure the task exists
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedProject = await createTask(projectId, task);

        // Ensure the project exists
        if (!updatedProject) {
            return res.status(404).json({ error: 'Unable to add task' });
        }

        res.status(200).json({ message: 'Task added successfully', updatedProject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Remove a task from a project
export const removeTask = async (req, res) => {
    try {
        const { taskId, projectId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'Invalid projectId or taskId' });
        }

        const task = await Task.findById(taskId);
        // Ensure the task exists
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const project = await Project.findById(projectId);
        // Ensure the project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updatedProject = await deleteTask(projectId, taskId);

        // Ensure the updated project exists after task deletion
        if (!updatedProject) {
            return res.status(404).json({ error: 'Failed to remove task from project' });
        }

        // Respond with the updated project
        res.status(200).json({ message: 'Task deleted successfully', updatedProject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// PUT: Update the status of a task within the project, ['New', 'In Progress', 'Completed']
export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId, projectId, status } = req.params;

        // Check if the new status is valid
        const possibleStatus = ['New', 'In Progress', 'Completed'];
        if (!possibleStatus.includes(status)){
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find the project and verify that it exists
        const project = await Project.findById(projectId).populate('tasks');
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the task is in the project
        const taskInProject = project.tasks.some(task => task._id.toString() === taskId);
        if (!taskInProject) {
            return res.status(404).json({ error: 'Task not found in the project' });
        }

        // Update task status
        const task = await Task.findByIdAndUpdate(
            taskId,
            { status: status },
            { new: true }
        );

        res.status(200).json({ message: 'Task status updated', task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update the status the project
export const updateStatus = async (req, res) => {
    try{
        const { projectId, status } = req.params;

        // Check if the new status is valid
        const possibleStatus = ['New', 'In Progress', 'Completed'];
        if (!possibleStatus.includes(status)){
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find the project and update its status
        const project = await Project.findByIdAndUpdate(
            projectId,
            { status: status },
            { new: true }
        );

        // Verify that the updated project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project status updated', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};