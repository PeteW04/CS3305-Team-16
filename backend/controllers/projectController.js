import Project from '../models/Projects.js';
import Task from '../models/Task.js';
import Channel from '../models/Channel.js';
import mongoose from 'mongoose';
import { createTask, deleteTask } from './taskController.js';
import { createChannel } from './messageController.js';

// GET: List all Projects
export const getAllProjects = async (req, res) => {
    try {
        // Automatically filter by the user's organizationId

        const projects = await Project.find({ organization: req.user.organizationId });

        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: List all Projects in an Organization
export const getAllProjectsByOrg = async (req, res) => {
    try {
        // Automatically filter by the user's organizationId
        const projects = await Project.find({ organization: req.user.organizationId });

        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Return a single Project based on its ID
export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        //if (project.organization.toString() !== req.user.organizationId) {
        //    return res.status(403).json({ message: 'Unauthorized access to this project' });
        //}

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a projects tasks
export const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId).populate("tasks");

        if (!project) {
            console.error('Project not found');
            return res.status(404).json({ error: 'Project not found' });
        }

        if (!Array.isArray(project.tasks)) {
            console.error("Tasks is not an array:", project.tasks);
            return res.status(500).json({ error: "Invalid task data" });
        }

        res.status(200).json(project.tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Create a new Project within an Organization 
export const createProject = async (req, res) => {
    const { title, description, deadline} = req.body;
    const { id } = req.user;

    try {
        // Create the project
        const newProject = await Project.create({
            title,
            description,
            organization: req.user.organizationId,
            employees: [id],
            manager: req.user._id,
            deadline
        });

        // Create the message channel
        const channel = await Channel.create({ type: 'project', members: [id], name: newProject.title, projectId: newProject._id });

        // Link the channel to the project
        newProject.chat = channel._id;
        await newProject.save();

        // Return the new project
        res.status(201).json(newProject);

    } catch (e) {
        console.error("Error in createProject:", e.message);
        return res.status(500).json({ message: e.message });
    }
};

// PUT: Change project name
export const changeTitle = async (req, res) => {
    try {
        const { projectId, newTitle } = req.params;

        // Find the project and update its title
        const project = await Project.findByIdAndUpdate(
            projectId,
            { title: newTitle },
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
    try {
        const { projectId, newDescription } = req.params;

        // Find the project and update its description
        const project = await Project.findByIdAndUpdate(
            projectId,
            { description: newDescription },
            { new: true }
        );

        // Verify that the updated project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project description updated', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// PUT: Change project deadline
export const changeDeadline = async (req, res) => {
    try {
        const { projectId, newDeadline } = req.params;

        // Find the project and update its deadline
        const project = await Project.findByIdAndUpdate(
            projectId,
            { deadline: newDeadline },
            { new: true }
        );

        // Verify that the updated project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deadline updated', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Add a worker to a project
export const addEmployee = async (req, res) => {
    try {
        const { employeeId, projectId } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ error: 'Invalid projectId or employeeId' });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the employee is already in the project
        if (project.employees.includes(employeeId)) {
            return res.status(404).json({ error: 'This employee is already in the project' });
        }

        const chat = await Channel.findById(project.chat);

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        //if (project.organization.toString() !== req.user.organizationId) {
        //    return res.status(403).json({ message: 'You cannot modify a project outside of your organization' });
        //}

        project.employees.addToSet(employeeId);
        await project.save();

        chat.members.addToSet(employeeId);
        await chat.save();

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
        const { title, description, deadline, priority } = req.body;
        const task = { title: title, description: description, deadline: deadline, priority }
        const userId = req.user._id;

        // Ensure a valid project id
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(403).json({ message: 'Project not found in your organization' });
        }

        const newTask = await createTask(projectId, task, userId, priority);

        // Ensure the new task exists
        if (!newTask) {
            return res.status(404).json({ error: 'Unable to add task' });
        }
        // Add the task to the project
        project.tasks.push(newTask._id);
        await project.save();

        res.status(200).json({ message: 'Task added successfully', newTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remove a task from a project
export const removeTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;

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

        // Ensure that the modifying user is part of the organization
        //if (project.organization.toString() !== req.user.organizationId) {
        //    return res.status(403).json({ message: 'Unauthorized to modify this project, as it is outside of your organization' });
        //}

        await deleteTask(projectId, taskId);

        project.tasks = project.tasks.filter(task => task.toString() !== taskId);
        await project.save();

        return res.status(200).json({ message: 'Task successfully deleted', project });
    } catch (error) {
        console.error("Error deleting task: ", error.message);
        return res.status(500).json({ error: error.message });
    }
};


// PUT: Update the status of a task within the project, ['New', 'In Progress', 'Completed']
// TODO
// Add more status options like awaiting approval, etc.
// This adds functionality to the project as the manager can sort tasks by ones they need to approve
export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId, projectId, status } = req.params;

        // Check if the new status is valid
        const possibleStatus = ['todo', 'progress', 'done'];
        if (!possibleStatus.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find the project and verify that it exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the task is in the project
        const taskInProject = project.tasks.includes(taskId);
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

// PUT: Update the status of the project
export const updateStatus = async (req, res) => {
    try {
        const { projectId, status } = req.params;

        // Check if the new status is valid
        const possibleStatus = ['New', 'In Progress', 'Completed'];
        if (!possibleStatus.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const project = await Project.findById(projectId);

        // Verify that the updated project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.organization.toString() !== req.user.organizationId) {
            return res.status(403).json({ message: 'Unauthorized to modify this project, as it is outside of your organisation' });
        }

        project.status = status;
        await project.save();

        res.status(200).json({ message: 'Project status updated', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};