const express = require('express');
import { createProject, getAllProjects, getProjectById, addEmployee, addTask, updateTaskStatus, updateStatus } from '../controllers/projectController';
import { checkUserRole } from '../middleware/checkUserRoleMiddleware';

const projectRouter = express.Router();

// Get all projects
projectRouter.get('/', getAllProjects);

// Get project by id
projectRouter.get('/:id', getProjectById);

// Create new project
projectRouter.post('/', checkUserRole('manager'), createProject);

// Add an employee
projectRouter.put('/:projectId/employees/:employeeId',  checkUserRole('manager'), addEmployee);

// Add a task
projectRouter.put('/:projectId/tasks/:taskId',  checkUserRole('manager'), addTask);

// Update a task's status ['New', 'In Progress', 'Completed']
projectRouter.put('/:projectId/tasks/:taskId/:status', updateTaskStatus);

// Update the projects status ['New', 'In Progress', 'Completed']
projectRouter.put('/:projectId/:status', updateStatus);

export default projectRouter;