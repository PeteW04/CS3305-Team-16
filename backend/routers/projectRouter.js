const express = require('express');
import { createProject, getAllProjects, getProjectById, addEmployee, addTask, updateTaskStatus, updateStatus } from '../controllers/projectController';

const projectRouter = express.Router();

// Get all projects
projectRouter.get('/', getAllProjects);

// Get project by id
projectRouter.get('/:id', getProjectById);

// Create new project
projectRouter.post('/', createProject);

// Add an employee
projectRouter.put('/:projectId/employees/:employeeId', addEmployee);

// Add a task
projectRouter.put('/:projectId/tasks/:taskId', addTask);

// Update a task's status ['New', 'In Progress', 'Completed']
projectRouter.put('/:projectId/tasks/:taskId/:status', updateTaskStatus);

// Update the projects status ['New', 'In Progress', 'Completed']
projectRouter.put('/:projectId/:status', updateStatus);

module.export = projectRouter;