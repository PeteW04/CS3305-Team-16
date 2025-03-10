import Project from '../models/Projects.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Channel from '../models/Channel.js';
import mongoose from 'mongoose';
import { createTask, deleteTask } from './taskController.js';
import { createChannel } from './messageController.js';

// GET: List all Projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ organization: req.user.organizationId })
            .populate('manager', 'firstName lastName');  // Add this line

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

// Get a users projects
export const getProjectsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const projects = await Project.find({
            organization: req.user.organizationId,
            employees: userId
        })

        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Create a new Project within an Organization 
export const createProject = async (req, res) => {
    const { title, description, deadline } = req.body;
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

// PUT: Update project 
export const updateProject = async (req, res) => {
    try {
        console.log("Request Received");
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error("Error in Update Project:", error.message);
        res.status(500).json({ error: error.message });
    }
}

// PUT: Add a worker to a project
export const addEmployee = async (req, res) => {
    try {
        const { employeeIds, projectId } = req.body;
        console.log('addEmployee projectId: ', projectId);
        console.log('addEmployee employeeIds: ', employeeIds);

        // Ensure the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Ensure the employee exists
        for (let employeeId of employeeIds) {
            const employee = await User.findById(employeeId);
            if (!employee) {
                return res.status(404).json({ error: 'User not found' });
            }
        }

        // Ensure the project has a text channel
        const chat = await Channel.findById(project.chat);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        // Add employee to project and chat
        for (let employeeId of employeeIds) {
            project.employees.addToSet(employeeId);
            chat.members.addToSet(employeeId);
        }
        await project.save();
        await chat.save();

        res.status(200).json({ message: 'Employee added successfully', project });
    } catch (error) {
        console.error("Error assigning project: ", error.message);
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
        const { title, description, deadline, priority, user } = req.body;
        const task = { title: title, description: description, deadline: deadline, priority }


        // Ensure a valid project id
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(403).json({ message: 'Project not found in your organization' });
        }

        const newTask = await createTask(projectId, task, user, priority);

        // Ensure the new task exists
        if (!newTask) {
            return res.status(404).json({ error: 'Unable to add task' });
        }
        // Add the task to the project
        project.tasks.push(newTask._id);
        await project.save();

        res.status(200).json({ message: 'Task added successfully', newTask });
    } catch (error) {
        console.error("Error adding task: ", error.message);
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

// DELETE: Delete a project
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify that the project exists
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const deletedProject = await Project.findByIdAndDelete(id);

        await Channel.findByIdAndDelete(deletedProject.chat);

        res.status(200).json(deletedProject);
    } catch (error) {
        console.error("Error deleting project: ", error.message);
        res.status(500).json({ error: error.message });
    }
}